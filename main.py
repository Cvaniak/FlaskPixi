from flask import Flask, render_template, session, copy_current_request_context, send_from_directory
from flask_socketio import SocketIO, emit, disconnect
from threading import Lock


async_mode = None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
thread = None
thread_lock = Lock()
socket_ = SocketIO(app, async_mode=async_mode)


@app.route('/')
def index():
    return render_template('index.html',
                           sync_mode=socket_.async_mode)

@app.route('/js/<path:path>')
def static_js_files(path):
    print(path)
    return send_from_directory('js', path)

@app.route('/img/<path:path>')
def static_img_files(path):
    print(path)
    return send_from_directory('img', path)

@socket_.on('my_event', namespace='/test')
def test_message(message):
    print("MyEvent", message)

@socket_.on('disconnect', namespace='/test')
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()
    print("Disconnect")


if __name__ == '__main__':
    socket_.run(app, debug=True)
