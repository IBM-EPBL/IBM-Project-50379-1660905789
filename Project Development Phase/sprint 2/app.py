from flask import Flask, render_template, url_for, redirect ,request
import ibm_db
import json

app = Flask(__name__)


dsn_hostname = "6667d8e9-9d4d-4ccb-ba32-21da3bb5aafc.c1ogj3sd0tgtu0lqde00.databases.appdomain.cloud" 
dsn_uid = "hsf34369"    
dsn_pwd = "4JlnEmracrTbkpti" 
dsn_driver = "{IBM DB2 ODBC DRIVER}"
dsn_database = "BLUDB"  
dsn_port = "30376"  
dsn_protocol = "TCPIP"  
dsn_security = "SSL"

dsn = (
    "DRIVER={0};"
    "DATABASE={1};"
    "HOSTNAME={2};"
    "PORT={3};"
    "PROTOCOL={4};"
    "UID={5};"
    "PWD={6};"
    "SECURITY={7};").format(dsn_driver, dsn_database, dsn_hostname, dsn_port, dsn_protocol, dsn_uid, dsn_pwd,dsn_security)

#print the connection string to check correct values are specified
print(dsn)


@app.route('/')
def home():
    return render_template('dashboard.html')


@app.route('/login', methods=['POST'])
def login():
    input_json = request.get_json(force=True) 
    print('data from client:',type(input_json))
    print('data from client:',input_json, input_json['email'])
    return render_template('dashboard.html')


@app.route('/dashboard', methods=['GET'])
def dashboard():
    return render_template('dashboard.html')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('login'))


@ app.route('/register', methods=['POST'])
def register():
    return render_template('register.html', form=form)


@app.route('/addproduct', methods=['POST'])
def login():
    input_json = request.get_json(force=True) 
    print('data from client:',type(input_json))
    print('data from client:',input_json, input_json['email'])
    return render_template('dashboard.html')

@app.route('/purchaseentry', methods=['POST'])
def login():
    input_json = request.get_json(force=True) 
    print('data from client:',type(input_json))
    print('data from client:',input_json, input_json['email'])
    return render_template('dashboard.html')


@app.route('/salesentry', methods=['POST'])
def login():
    input_json = request.get_json(force=True) 
    print('data from client:',type(input_json))
    print('data from client:',input_json, input_json['email'])
    return render_template('dashboard.html')


@app.route('/transactions', methods=['GET'])
def login():
    input_json = request.get_json(force=True) 
    print('data from client:',type(input_json))
    print('data from client:',input_json, input_json['email'])
    return render_template('dashboard.html')

@app.route('/products', methods=['GET'])
def login():
    input_json = request.get_json(force=True) 
    print('data from client:',type(input_json))
    print('data from client:',input_json, input_json['email'])
    return render_template('dashboard.html')


if __name__ == "__main__":
    app.run(debug=True)
