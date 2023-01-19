from flask import Flask
app = Flask(__name__)

@app.route('/')
def root():
    return 'This is the root'

@app.route('/sign_in',methods = ['POST'] )
def sign_in():
    return 'Singing in!'

@app.route('/sign_up',methods=["POST"])
def sign_up():
    return 'Singing up!'

@app.route('/sign_out',methods = ['POST'] )
def sign_out():
    return 'Singing out!'

@app.route('/change_password',methods = ['POST'] )
def change_password():
    return 'Change password!'

@app.route('/get_user_data_by_token',methods = ['POST'] )
def get_user_data_by_token():
    return 'Getting userdata by token!'

@app.route('/get_user_data_by_email',methods = ['POST'] )
def get_user_data_by_email():
    return 'Get user data by email!'

@app.route('/get_user_messages_by_token',methods = ['POST'] )
def get_user_messages_by_token():
    return 'Singing in!'

@app.route('/get_user_messages_by_email',methods = ['POST'] )
def get_user_messages_by_email():
    return 'Getting user messages by email!'

@app.route('/post_message',methods = ['POST'] )
def post_message():
    return 'Post Message!'
