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
            
        result = Feedback(name=name, email=email, feedback=feedback)
        db.session.add(result)
        db.session.commit()
        
        return redirect("/", code=302)

    return render_template("feedback.html")


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
    results = db.session.query(Station_Coordinate.station_id,
                               Station_Coordinate.station_name,
                               Station_Coordinate.lat,
                               Station_Coordinate.lon,
                               Station_Coordinate.capacity).all()

    return jsonify(results)

if __name__ == "__main__":
    app.run()#host-'0.0.0.0', port=8080)
