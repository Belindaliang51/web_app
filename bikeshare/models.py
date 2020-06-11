from .app import db


class Station_Coordinate(db.Model):
    __tablename__ = 'station_coordinate'

    station_id = db.Column(db.Integer, primary_key=True)
    station_name = db.Column(db.String(255))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    capacity = db.Column(db.Integer)

    def __repr__(self):
        return '<Station_Coordinate %r>' % (self.name)


class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    feedback = db.Column(db.String(255))

    def __repr__(self):
        return '<Feedback %r>' % (self.name)
