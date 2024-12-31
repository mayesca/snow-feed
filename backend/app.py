import os
from flask import Flask, request
from backend.src.gateway.ski_resort_gateway import SkiResortGateway
from backend.src.gateway.weather_gateway import WeatherGateway
from flask_cors import CORS

import inject


def configure_dependencies(binder: inject.Binder):
    binder.bind(SkiResortGateway, SkiResortGateway())
    binder.bind(WeatherGateway, WeatherGateway())


def create_app(test_config=None):
    app = Flask(__name__)
    CORS(
        app,
        resources={
            r"/*": {
                "origins": ["http://localhost:3000"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                # "allow_headers": ["Content-Type"],
            }
        },
    )

    inject.configure(configure_dependencies, clear=True)

    @app.route("/")
    def index():
        return "Hello"

    @app.route("/ski-resorts", methods=["GET"])
    def get_ski_resorts():
        ski_resort_gateway = inject.instance(SkiResortGateway)
        return ski_resort_gateway.get_ski_resorts()

    @app.route("/ski-resorts", methods=["POST"])
    def post_ski_resort():
        ski_resort_gateway = inject.instance(SkiResortGateway)
        return ski_resort_gateway.post_ski_resort(request.json)

    @app.route("/ski-resorts/<name>", methods=["DELETE"])
    def delete_ski_resort(name):
        ski_resort_gateway = inject.instance(SkiResortGateway)
        return ski_resort_gateway.delete_ski_resort(name)

    @app.route("/weather", methods=["GET"])
    def get_weather():
        latitude = request.args.get("latitude")
        longitude = request.args.get("longitude")
        weather_gateway = inject.instance(WeatherGateway)
        return weather_gateway.get_weather_data(latitude, longitude)

    @app.errorhandler(404)
    def not_found(error):
        return "404 Bad Request"

    return app
