from .app import db


class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    feedback = db.Column(db.String(255))

    def __repr__(self):
        return '<Feedback %r>' % (self.name)
