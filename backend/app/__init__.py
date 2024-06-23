from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes import main  # Adjusted import statement to be relative
    app.register_blueprint(main)

    return app
