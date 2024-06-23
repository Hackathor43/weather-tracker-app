import os
import requests
from flask import Blueprint, request, jsonify, render_template
from flask_cors import CORS, cross_origin

main = Blueprint('main', __name__)
CORS(main, support_credentials=True)



@main.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    zip_code = data.get('zip_code')
    country_code = data.get('country_code')
    api_key = '6f35bdfe2712f2c96fbe705130c136ad'

    print(zip_code)
    print(country_code)

    weather_data = {}

    def fetch_weather(location):
        url = f'http://api.openweathermap.org/data/2.5/weather?zip={location},{country_code}&appid={api_key}&units=metric'
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            return {'error': str(http_err)}
        except Exception as err:
            return {'error': str(err)}
    
    def fetch_forecast(location):
        try:
            url = f'http://api.openweathermap.org/data/2.5/forecast?zip={location},{country_code}&appid={api_key}&units=metric'
            response = requests.get(url)
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            return {'error': str(http_err)}
        except Exception as err:
            return {'error': str(err)}

    weather_data['user_location'] = fetch_weather(zip_code)
    weather_data['forecast'] = fetch_forecast(zip_code)

    return jsonify(weather_data)


@main.route('/get_weather_by_cities', methods=['POST'])
def get_weather_by_cities():
    data = request.get_json()
    cities = data.get('cities')
    api_key = '6f35bdfe2712f2c96fbe705130c136ad'

    weather_data = {}

    def fetch_weather_by_city(location):
        try:
            url = f'http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric'
            response = requests.get(url)
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            return {'error': str(http_err)}
        except Exception as err:
            return {'error': str(err)}

    if cities is not None:
        for city in cities:
            weather_data[city] = fetch_weather_by_city(city)

    return jsonify(weather_data)