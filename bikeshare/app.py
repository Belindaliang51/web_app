# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', '') or "postgres://tmuhxnjmfuqawf:638b904e87bffc5cf9e030cae615ca3fc2d132e7ee573d7eaa4888ea6edf91de@ec2-3-222-150-253.compute-1.amazonaws.com:5432/d1ngrvstakv97r"
# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from .models import Feedback, Station_Coordinate


# create route that renders index.html template
@app.route("/")
def home():
   return render_template("index.html")

@app.route("/data")
def dataset():
    return render_template("data.html")

@app.route("/database")
def database():
    return render_template("database.html")

@app.route("/d31")
def d31():
   return render_template("d31.html")


@app.route("/d32")
def d32():
    return render_template("d32.html")


@app.route("/map")
def map():
   return render_template("map.html")

# Query the database and send the jsonified results
@app.route("/send", methods = ["POST", "GET"])
def feedback():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        feedback = request.form["feedback"]
            
        feedback = Feedback(name=name, email=email, feedback=feedback)
        db.session.add(feedback)
        db.session.commit()
        
        return redirect("/", code=302)

    return render_template("feedback.html")


@app.route("/api/feedbacks")
def feedbackinfo():
    results = db.session.query(Feedback.name, Feedback.feedback).all()

    #hover_text = [result[0] for result in results]
    name = [result[0] for result in results]
    feedback = [result[1] for result in results]

    feedback_data = [{
        #"name": name,
        "feedback": feedback,
        #"text": hover_text,
    }]

    return jsonify(feedback_data)

############################################
# Pull data to front end
@app.route("/api/stations")
def developer():    
    # Query all station coordinate data
    results = db.session.query(Station_Coordinate.station_id,
                               Station_Coordinate.station_name,
                               Station_Coordinate.lat,
                               Station_Coordinate.lon,
                               Station_Coordinate.capacity).all()

    all_stations = []
    for station_id, station_name, lat, lon, capacity in results:
        station_dict = {}
        station_dict["station_id"] = station_id
        station_dict["station_name"] = station_name
        station_dict["lat"] = lat
        station_dict["lon"] = lon
        station_dict["capacity"] = capacity
        all_stations.append(station_dict)

    return jsonify(all_stations)

if __name__ == "__main__":
    app.run()#host-'0.0.0.0', port=8080)
