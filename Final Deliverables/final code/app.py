from flask import Flask, render_template, url_for, redirect ,request,jsonify
import ibm_db
import json
import random

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

conn = ibm_db.connect(dsn,"","")

def updateHistory(code,name,quantity,purchasedPrice,soldPrice):
    insert_sql='INSERT INTO historys VALUES (?,?,?,?,?)'
    pstmt=ibm_db.prepare(conn, insert_sql)
    ibm_db.bind_param(pstmt,1,code)
    ibm_db.bind_param(pstmt,2,name)
    ibm_db.bind_param(pstmt,3,quantity)
    ibm_db.bind_param(pstmt,4,purchasedPrice)
    ibm_db.bind_param(pstmt,5,soldPrice)
    ibm_db.execute(pstmt)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/login', methods=['POST'])
def login():
    input_json = request.get_json(force=True) 
    email = input_json['email']
    password = input_json["password"]
    sql='SELECT * FROM users WHERE email =?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt,1,email)
    ibm_db.execute(stmt)
    acnt=ibm_db.fetch_assoc(stmt)
    print("scnt",acnt)
    if (not acnt):
        return jsonify(acnt)
    if password in acnt.values() :
        return jsonify(True)
    else:
        return jsonify(False)
    


@app.route('/dashboard', methods=['GET'])
def dashboard():
    return render_template('dashboard.html')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('login'))


@ app.route('/register', methods=['POST'])
def register():
    input_json = request.get_json(force=True) 
    username=input_json["username"]
    email=input_json["email"]
    password=input_json["password"]
    sendreport=input_json["sendReport"]
    print("hello da",sendreport)
    sql='SELECT * FROM users WHERE email =?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt,1,email)
    ibm_db.execute(stmt)
    acnt=ibm_db.fetch_assoc(stmt)
    print("acnt",acnt)
    if acnt:
        return jsonify(False)
    else:
        insert_sql="INSERT INTO users (username, email, password, send_email, values) VALUES (?,?,?,?,?)"
        pstmt=ibm_db.prepare(conn, insert_sql)
        ibm_db.bind_param(pstmt,1,username)
        ibm_db.bind_param(pstmt,2,email)
        ibm_db.bind_param(pstmt,3,password)
        ibm_db.bind_param(pstmt,4,sendreport)
        ibm_db.bind_param(pstmt,5,20)
        ibm_db.execute(pstmt)
        return jsonify(True)      
    


@app.route('/addproduct', methods=['POST'])
def addProduct():
    input_json = request.get_json(force=True) 
    code=input_json["CODE"]
    name=input_json["NAME"]
    purchasePrice=input_json["PURCHASEPRICE"]
    salePrice=input_json["SALEPRICE"]
    sql='SELECT * FROM products WHERE code =? OR name =?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt,1,code)
    ibm_db.bind_param(stmt,2,name)
    ibm_db.execute(stmt)
    acnt=ibm_db.fetch_assoc(stmt)
    print("product",acnt)
    if acnt:
        return jsonify(False)
    
    else:
        insert_sql='INSERT INTO products VALUES (?,?,?,?,?)'
        pstmt=ibm_db.prepare(conn, insert_sql)
        ibm_db.bind_param(pstmt,1,code)
        ibm_db.bind_param(pstmt,2,name)
        ibm_db.bind_param(pstmt,3,0)
        ibm_db.bind_param(pstmt,4,purchasePrice)
        ibm_db.bind_param(pstmt,5,salePrice)
        ibm_db.execute(pstmt)
        return jsonify()

@app.route('/purchaseentry', methods=['POST'])
def purchaseentry():
    input_json = request.get_json(force=True) 
    code=input_json["CODE"]
    name=input_json["NAME"]
    purchasedPrice=int(input_json["PURCHASEDPRICE"])
    InputQuantity=int(input_json["QUANTITY"])
    sql='SELECT * FROM products WHERE code =? OR name =?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt,1,code)
    ibm_db.bind_param(stmt,2,name)
    ibm_db.execute(stmt)
    acnt=ibm_db.fetch_assoc(stmt)
    if (not acnt):
        return jsonify(False)
    
    else:
        id=acnt["CODE"]
        quantity = acnt["QUANTITY"] + InputQuantity
        insert_sql='update products set quantity = ? where code = ?'
        pstmt=ibm_db.prepare(conn, insert_sql)
        ibm_db.bind_param(pstmt,1,quantity)
        ibm_db.bind_param(pstmt,2,id)
        ibm_db.execute(pstmt)
        updateHistory(acnt["CODE"],acnt["NAME"],InputQuantity,purchasedPrice,0)
        return jsonify(True)


@app.route('/salesentry', methods=['POST'])
def salesentry():
    input_json = request.get_json(force=True) 
    code=input_json["CODE"]
    name=input_json["NAME"]
    soldPrice=int(input_json["SOLDPRICE"])
    InputQuantity=int(input_json["QUANTITY"])
    sql='SELECT * FROM products WHERE code =? OR name =?'
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt,1,code)
    ibm_db.bind_param(stmt,2,name)
    ibm_db.execute(stmt)
    acnt=ibm_db.fetch_assoc(stmt)
    #print("product",quantity)
    if (not acnt):
        return jsonify(False)
    
    else:
        id=acnt["CODE"]
        quantity = acnt["QUANTITY"] - InputQuantity
        if quantity < 0:
            return jsonify("OPERATION INVALID: Available quantity " + str(acnt["QUANTITY"]))
        insert_sql='update products set quantity = ? where code = ?'
        pstmt=ibm_db.prepare(conn, insert_sql)
        ibm_db.bind_param(pstmt,1,quantity)
        ibm_db.bind_param(pstmt,2,id)
        ibm_db.execute(pstmt)
        updateHistory(acnt["CODE"],acnt["NAME"],InputQuantity,0,soldPrice)
        return jsonify(True)


@app.route('/transactions', methods=['GET'])
def transactions():
    sql='SELECT * FROM historys'
    stmt = ibm_db.prepare(conn, sql)
    result=ibm_db.execute(stmt)
    print(result)

    transactions=[]
    row = ibm_db.fetch_assoc(stmt)
    while(row):
        transactions.append(row)
        row = ibm_db.fetch_assoc(stmt)
        print(row)
    transactions=tuple(transactions)
    return jsonify(transactions)

@app.route('/products', methods=['GET'])
def products():
    sql='SELECT * FROM products'
    stmt = ibm_db.prepare(conn, sql)
    result=ibm_db.execute(stmt)
    print(result)

    products=[]
    row = ibm_db.fetch_assoc(stmt)
    print(row)
    while(row):
        products.append(row)
        row = ibm_db.fetch_assoc(stmt)
        print(row)
    products=tuple(products)
    print(products)
    return jsonify(products)
    


if __name__ == "__main__":
    app.run(debug=True)
