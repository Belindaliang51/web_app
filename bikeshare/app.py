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
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from .models import Feedback


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("feedback.html")


@app.route("/data")
def dataset():
    return render_template("data.html")

# Query the database and send the jsonified results
@app.route("/feedback", methods=["GET", "POST"])
def feedback():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        feedback = request.form["feedback"]
        
        result = Feedback(name=name, email=email, feedback=feedback)
        db.session.add(result)
        db.session.commit()
        return redirect("/", code=302)
    
    return render_template("success.html")


@app.route("/api/feedbacks")
def feedbacks():
    results = db.session.query(Feedback.name, Feedback.email, Feedback.feedback).all()

    hover_text = [result[0] for result in results]
    email = [result[1] for result in results]
    feedback = [result[2] for result in results]

    feedback_data = [{
        "type": "scattergeo",
        "locationmode": "USA-states",
        "email": email,
        "feedback": feedback,
        "text": hover_text,
        "hoverinfo": "text",
        "marker": {
            "size": 50,
            "line": {
                "color": "rgb(8,8,8)",
                "width": 1
            },
        }
    }]


    return jsonify(feedback_data)


############################################
# Pull data to front end
@app.route("/api/stations")
def developer():    
    # Query all station coordinate data
    results = session.query(station_coordinate.station_id,
                            station_coordinate.station_name,
                            station_coordinate.lat,
                            station_coordinate.lon,
                            station_coordinate.capacity).all()


    # Create a dictionary from the row data and append to a list of stations
    stations = []
    for station_id, station_name, lat, lon, capacity in results:
        station_coordinate = {}
        station_coordinate["station_id"] = station_id
        station_coordinate["station_name"] = station_name
        station_coordinate["lat"] = lat
        station_coordinate["lon"] = lon
        station_coordinate["capacity"] = capacity
        station_coordinate.append(stations)

    return jsonify(station_coordinate)

if __name__ == "__main__":
    app.run()
