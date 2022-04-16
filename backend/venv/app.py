import datetime, bcrypt, random, threading, time
from flask import Flask,request,jsonify,url_for,redirect
from pymongo import MongoClient
from flask_jwt_extended import JWTManager,jwt_required,create_access_token
from dotenv import load_dotenv
import os
from flask_cors import CORS,cross_origin
from functions import pick_best_ride,distance_calculator,distance
from math import radians, cos, sin, asin, sqrt
import datetime

load_dotenv()

app=Flask(__name__)
CORS(app)
# CORS(app, support_credentials=True)

#initializing database and collections

client = MongoClient(os.getenv("MONGO_URL"))
db = client["database"]
user = db["user"]
drivers = db["drivers"]
user_requests = db["user_requests"]
rides = db["rides"]
completed_rides = db["completed_rides"]

#authentication

app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=500)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(minutes=100)
jwt = JWTManager(app)

#user register routes

@app.route("/user/register",methods=["POST"])
@cross_origin(supports_credentials=True)

def user_register():
    
        email=request.json["email"]
        test=user.find_one({"email":email})
        
        if test:
            print("user already exist")
            return jsonify(message="User Already Exist",status=409)

        else:
            password=request.json["password"]
            hashed=bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
            firstname=request.json["firstname"]
            lastname=request.json["lastname"]
            phone=request.json["phone"]
            decodedpw = hashed.decode('utf-8')
            user_input = {'user_id' :str(firstname[:3]+str(random.randrange(100,99999))) ,'firstname':firstname,'lastname':lastname,'phone':phone, 'email': email, 'password': decodedpw}
            user.insert_one(user_input)
            print("user created successfully")
            return jsonify(message="User created sucessfully.Please log in",status=200)

#user login route
@app.route("/user/login",methods=["POST"])
@cross_origin(supports_credentials=True)


def user_login():

        email=request.json["email"]
        password=request.json["password"]
        test=user.find_one({"email":email,"role":"user"})

        if test:
            hashedpassword=test["password"]
            if bcrypt.checkpw(password.encode('utf-8'),hashedpassword.encode('utf-8')):
                access_token = create_access_token(identity=email)
                print("hello")
                return jsonify(message="Login Succeeded!", access_token=access_token,user_name=test["firstname"],user_id=test["user_id"], status=200)
            else:
                print("password is incorrect")
                return jsonify(message="Password is incorrect",status=409)
        else:
            print("user does not exist")
            return jsonify(message="User Doesn't Exist",status=409)

#admin login route
@app.route("/admin/login",methods=["POST"])
@cross_origin(supports_credentials=True)
@jwt_required
def admin_login():
    print("hii")
    email=request.json["email"]
    password=request.json["password"]
    test=user.find_one({"email":email,"role":"admin"})
    if test:
        hashedpassword=test["password"]
        if bcrypt.checkpw(password.encode('utf-8'),hashedpassword.encode('utf-8')):
            access_token = create_access_token(identity=email)
            print("hello")
            return jsonify(message="Login Succeeded!", access_token=access_token,user_name=test["firstname"],user_id=test["user_id"], status=200)
        else:
            print("password is incorrect")
            return jsonify(message="Password is incorrect",status=409)
    else:
        print("user does not exist")
        return jsonify(message="User Doesn't Exist",status=409)
    email=request.json["email"]
    password=request.json["password"]
    test=user.find_one({"email":email,"role":"admin"})
    if test:
        hashedpassword=test["password"]
        if bcrypt.checkpw(password.encode('utf-8'),hashedpassword.encode('utf-8')):
            access_token = create_access_token(identity=email)
            print("hello")
            return jsonify(message="Login Succeeded!", access_token=access_token,user_name=test["firstname"],user_id=test["user_id"], status=200)
        else:
            print("password is incorrect")
            return jsonify(message="Password is incorrect",status=409)
    else:
        print("user does not exist")
        return jsonify(message="User Doesn't Exist",status=409)

#register driver routes

@app.route("/driver/register",methods=["POST"])
@cross_origin(supports_credentials=True)

def driver_register():
    
        email=request.json["email"]
        test=drivers.find_one({"email":email})
        
        if test:
            print("user already exist")
            return jsonify(message="User Already Exist",status=409)

        else:
            password=request.json["password"]
            hashed=bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
            firstname=request.json["firstname"]
            lastname=request.json["lastname"]
            phone=request.json["phone"]
            decodedpw = hashed.decode('utf-8')
            location = [12,8]
            user_input = {'user_id' :str(firstname[:3]+str(random.randrange(100,99999))) ,'firstname':firstname,'lastname':lastname,'phone':phone, 'email': email, 'password': decodedpw,'location' : location}
            drivers.insert_one(user_input)
            print("user created successfully")
            return jsonify(message="User created sucessfully.Please log in",status=200)

#driver login route
@app.route("/driver/login",methods=["POST"])
@cross_origin(supports_credentials=True)

def driver_login():

        email=request.json["email"]
        password=request.json["password"]
        test=drivers.find_one({"email":email})

        if test:
            hashedpassword=test["password"]
            if bcrypt.checkpw(password.encode('utf-8'),hashedpassword.encode('utf-8')):
                access_token = create_access_token(identity=email)
                print("hello")
                return jsonify(message="Login Succeeded!", access_token=access_token,user_name=test["firstname"],user_id=test["user_id"],driver_location=test["location"], status=200)
            else:
                print("password is incorrect")
                return jsonify(message="Password is incorrect",status=409)
        else:
            print("hello world")
            return jsonify(message="User Doesn't Exist",status=409)

#user request ride route
@app.route("/user",methods=["POST"])
@cross_origin(supports_credentials=True)
@jwt_required()

def user_page():

    request_type = request.json["request_type"]
    if request_type == "book":
        user_id = request.json["user_id"]
        user_details = user.find_one({"user_id":user_id})
        user_name = user_details["firstname"]
        customer_location = request.json["pickup_location"]
        destination_location = request.json["destination_location"]

        user_requests.insert_one({"user_id" : user_id,"user_name":user_name,"request_type":"book","location":customer_location,"destination":destination_location,"status":"pending"})
    elif request_type == "ride_details" :
        user_id = request.json["user_id"]
        request_details = user_requests.find_one({"user_id":user_id})
        customer_location = request_details["location"]
        destination_location = request_details["destination"]
        return jsonify(message = "User details",customer_location = customer_location,destination_location = destination_location,status = 200)
    else :
        return jsonify(message = "Invalid request type",status = 400)
    return jsonify(message="Your ride has booked !",customer_location=customer_location,destination_location=destination_location,status=200)


@app.route("/driver",methods=["POST"])
@cross_origin(supports_credentials=True)
@jwt_required()

def driver_page():

    user_name = request.json["user_name"]
    request_type = request.json["request_type"]
    driver_location = request.json["driver_location"]
    available_rides = []

    if request_type == "accept" :
        #get all users from database
        for x in user_requests.find({'status':"pending"}) :
            available_rides.append([x["user_name"],x["location"],x["destination"]])
        
        if(len(available_rides) == 0) :
            return jsonify(message="No rides available",status=409)

        else :
            ride_index = pick_best_ride(available_rides,driver_location)
            picked_ride = available_rides[ride_index]
            picked_ride_details = user_requests.find_one({"user_name":picked_ride[0]})

            customer_name = picked_ride_details["user_name"]
            customer_location = picked_ride_details["location"]
            customer_destination = picked_ride_details["destination"]
            customer_id = picked_ride_details["user_id"]
            ride_id = customer_name[-3:]+str(random.randrange(100,99999))
            user_requests.update_one({"user_name":picked_ride[0]},{"$set":{"status":"accepted"}})
            return jsonify(message="Accepted a ride",customer_name = customer_name,customer_location=customer_location,
            customer_destination = customer_destination,customer_id = customer_id,ride_id = ride_id, status=200)
        
    return jsonify(message="Welcome to the home page !",status=200)

#rides route

@app.route('/rides',methods=["POST"])
@cross_origin(supports_credentials=True)
@jwt_required()

def ride_page():
    date = datetime.datetime.now()
    current_date = date.strftime("%d-%m-%Y")
    current_date = str(current_date)
    time = date.strftime("%H:%M")

    ride_otp = random.randrange(1000,9999)
    request_type = request.json["request_type"]
    
    #checking if rides are available

    if request_type == "checkrides" :
        ride_requests = user_requests.find({"status" : "pending"});
        rides_list = []
        for i in ride_requests :
            rides_list.append(i)
        return jsonify(message = "available rides count",available_rides = len(rides_list),status = 200)
    
    #checking the status

    elif(request_type == "checkstatus"):
        customer_id = request.json["customer_id"]
        customer_location = request.json["customer_location"]
        customer_destination = request.json["customer_destination"]
        ride_id = request.json["ride_id"]

        driver_id = request.json["driver_id"]
        driver_details = drivers.find_one({"user_id":driver_id})
        driver_location = driver_details["location"]

        user_details = user_requests.find_one({"user_id":customer_id})
        ride_details = rides.find_one({"ride_id" : ride_id})

        # fare calculation
        total_distance = distance(customer_location[0],customer_destination[0],customer_location[1],customer_destination[1])
        fare = 30 +((total_distance-1)*10)
        fare = round(fare,2)

        if not ride_details :
            rides.insert_one({"user_id":customer_id,"driver_id":driver_id,"ride_id":ride_id,"customer_location":customer_location,
            "customer_destination":customer_destination,"driver_location":driver_location,"status":"riding","fare":fare,"otp":ride_otp,"date" : current_date,"time" : time})
        
        ride_details = rides.find_one({"ride_id" : ride_id})
        ride_status = ride_details["status"]

        if request_type == "checkstatus" :
            fare = ride_details["fare"]

            if ride_status == "riding" :
                rides.update_one({"ride_id":ride_id},{"$set":{"status":"riding to customer"}})
                return jsonify(message ="Riding to customer",fare = fare,status=200)
            elif ride_status == "riding to customer" :
                rides.update_one({"ride_id":ride_id},{"$set":{"status":"reached customer location"}})
                return jsonify(message ="Reached customer location",fare = fare,status=200)
            elif ride_status == "reached customer location" :
                rides.update_one({"ride_id":ride_id},{"$set":{"status":"riding to destination"}})
                return jsonify(message ="Riding to destination",status=200)
            elif ride_status == "riding to destination" :
                rides.update_one({"ride_id":ride_id},{"$set":{"status":"payment pending"}})
                return jsonify(message ="Payment pending",status=200)
            elif ride_status == "payment done" :
                rides.update_one({"ride_id":ride_id},{"$set":{"status":"completed"}})
                return jsonify(message ="Completed",status=200)
            elif ride_status == "completed" :
                current_ride_details = rides.find_one({"ride_id":ride_id})
                completed_rides.insert_one(current_ride_details)
                rides.delete_one({"ride_id":ride_id})
                user_requests.delete_one({"user_id":customer_id})
                return jsonify(message = "Accept new ride",status=200)

            return jsonify(message="Ride completed",status=200)

    # checking if the ride is started

    elif request_type == "isridestarted" :

        ride_id = request.json["ride_id"]
        user_id = request.json["user_id"]
        user_ride = user_requests.find_one({"user_id":user_id})
        ride_details = rides.find_one({"user_id":user_id})

        if(ride_details) :

            driver_id = ride_details["driver_id"]
            driver_name = drivers.find_one({"user_id":driver_id})["firstname"]
            driver_location = ride_details["driver_location"]
            driver_phone = drivers.find_one({"user_id":driver_id})["phone"]
            fare = ride_details["fare"]
            ride_status = ride_details["status"]
            ride_otp = ride_details["otp"]

            if ride_status == "riding" :
                return jsonify(message ="Ride started",driver_id=driver_id,driver_name=driver_name,driver_phone=driver_phone,driver_location = driver_location, fare = fare,status=200)
            elif ride_status == "riding to customer" :
                return jsonify(message ="Riding to customer",driver_id=driver_id,driver_name=driver_name,driver_phone=driver_phone,driver_location = driver_location,fare = fare,otp = ride_otp,status=200)
            elif ride_status == "reached customer location" :
                return jsonify(message ="Reached customer location",driver_id=driver_id,driver_name=driver_name,driver_phone=driver_phone,driver_location = driver_location,fare = fare,otp = ride_otp,status=200)
            elif ride_status == "riding to destination" :
                return jsonify(message="Riding to destination",driver_id=driver_id,driver_name=driver_name,driver_phone=driver_phone,driver_location = driver_location,status=200)
            elif ride_status == "payment pending" :
                return jsonify(message="Payment pending",driver_id=driver_id,driver_name=driver_name,driver_phone=driver_phone,driver_location = driver_location,fare = fare,otp = ride_otp,status=200)
            elif ride_status == "payment done" :
                return jsonify(message ="Payment done",status=200)
            elif ride_status == "completed" :
                return jsonify(message ="Ride Completed",status=200)
            
        if user_ride :
            return jsonify(message = "Wait for ride to start",status=200)
        else :
            return jsonify(message = "Book a new ride",status=409)
    elif request_type == "checkotp" :

        ride_id = request.json["ride_id"]
        ride_details = rides.find_one({"ride_id":ride_id})
        ride_otp = ride_details["otp"]
        driver_otp = request.json["otp"]

        if(int(ride_otp) == int(driver_otp)) :
            return jsonify(message = "OTP verified",status=200)
        else :
            return jsonify(message = "OTP not verified",status=409)

    elif request_type == "payamount" :
        user_id = request.json["user_id"]
        print(user_id)
        rides.update_one({"user_id":user_id},{"$set":{"status":"payment done"}})
        return jsonify(message = "Payment done",status=200)

    return jsonify(message = "Welcome to ride page",status=200)

@app.route('/history',methods=["POST"])
@cross_origin(supports_credentials=True)
@jwt_required()

def history():
    request_type = request.json["request_type"]

    if(request_type == "user_history") :
        user_id = request.json["user_id"]
        user_history = completed_rides.find({"user_id":user_id})
        history_list = []
        for ride in user_history :
            ride_details = [ride["ride_id"],ride["fare"],ride["status"],ride["date"],ride["time"]]
            history_list.append(ride_details)
        return jsonify(message = "History",history = history_list[::-1],status=200)
    
    
    elif request_type == "driver_history" :

        driver_id = request.json["driver_id"]
        driver_history = completed_rides.find({"driver_id":driver_id})
        history_list = []
        for ride in driver_history :
            ride_details = [ride["ride_id"],ride["fare"],ride["status"],ride["date"],ride["time"]]
            history_list.append(ride_details)
        return jsonify(message = "History",history = history_list[::-1],status=200)    

    else :
        #get all history from the database
        all_history = completed_rides.find()
        history_list = []
        for data in all_history :
            ride_details = [data["user_id"],data["driver_id"],data["ride_id"],data["status"],data["fare"],data["date"],data["time"]]
            history_list.append(ride_details)
        return jsonify(message = "History",full_history = history_list[::-1],status=200)

@app.route('/details',methods=["POST"])
@cross_origin(supports_credentials=True)
@jwt_required()

def details():

    #get all the user details from database and store in list
    request_type = request.json["request_type"]
    if(request_type == "user_details") :
        #get all user details from database
        user_details = user.find()
        user_list = []
        for data in user_details :
            user_detail = [data["user_id"],data["firstname"],data["lastname"],data["phone"],data["email"]]
            if(data["firstname"] != "Admin1") :
                user_list.append(user_detail)
        return jsonify(message = "User details",user_details = user_list,status=200)
    
    elif request_type == "driver_details" :
        #get all driver details from database
        driver_details = drivers.find()
        driver_list = []
        for driver in driver_details :
            driver_detail = [driver["user_id"],driver["firstname"],driver["lastname"],driver["phone"],driver["email"]]
            driver_list.append(driver_detail)
        return jsonify(message = "Driver details",driver_details = driver_list,status=200)

    elif request_type == "request_details" :
        #get all request from database
        request_details = user_requests.find()
        request_list = []
        for data in request_details :
            request_detail = [data["user_id"],data["user_name"],data["request_type"],data["status"]]
            request_list.append(request_detail)
        return jsonify(message = "Request details",request_details = request_list,status=200)

    elif request_type == "rides_details" :
        #get all rides from database
        rides_details = rides.find()
        rides_list = []
        for data in rides_details :
            rides_detail = [data["ride_id"],data["user_id"],data["driver_id"],data["status"],data["date"],data["time"],data["fare"]]
            rides_list.append(rides_detail)
        return jsonify(message = "Rides details",rides_details = rides_list,status=200)

if __name__ == '__main__':
    app.run(debug=True)