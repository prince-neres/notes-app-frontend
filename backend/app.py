from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import os
import json
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt)
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

app = Flask(__name__)

# Coonfigurações da API
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://prince:val44@localhost/notes_app'
app.config['SECRET_KEY'] = os.urandom(12)
app.config['JWT_SECRET_KEY'] = 'JWT_SECRET_KEY%#!@'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_BLACKLIST_ENABLED'] = True

jwt = JWTManager(app)
db = SQLAlchemy(app)
blacklist_jwt = set()


CORS(app, resources={r'/api/*': {'origins': '*'}}, supports_credentials=True)


# Tabela de usuários
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True)
    username = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(10), nullable=True)
    schoolName = db.Column(db.String(20), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow())


# Tabela de Notas
class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True)
    notes = db.Column(db.PickleType, nullable=True)


# Login
@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Pega dados da requisição
        content = json.loads(request.data.decode())
        # Localiza usuário no Banco
        user = User.query.filter_by(email=content['email']).first()

        error_data = {'message': 'Incorrect email or password', 'code': 'Error'}
        # Checa se há email no Banco
        if user is None:
            return make_response(jsonify(error_data), 404)

        # Valida senha
        elif content['password'] != user.password:
            return make_response(jsonify(error_data), 404)

        data = {'message': 'Login', 'code': 'SUCCESS', 'username': user.username,
                'accessToken': create_access_token(identity=content['email'])}
        return make_response(jsonify(data), 200)
    except:
        data = {'message': 'Error', 'code': 'ERROR'}
    return make_response(jsonify(data), 400)


# Cadastro no Banco de dados
@app.route('/api/registration', methods=['POST'])
def registration():
    try:
        # Pega os dados recebidos da requisição
        content = json.loads(request.data.decode())

        # Cria um novo usuário no Banco
        user = User()
        user.username = content['username']
        user.email = content['email']
        user.password = content['password']
        user.schoolName = content['schoolName']

        # Cria uma lista de notas no Banco
        notes = Notes()
        notes.email = content['email']
        notes.notes = []

        # Coloca no Banco
        try:
            db.session.add(user)
            db.session.add(notes)
            db.session.commit()
        except:
            data = {'message': 'This email is already registered in the system', 'code': 'ERROR'}
            return make_response(jsonify(data), 400)

        data = {'message': 'Created', 'code': 'SUCCESS', 'accessToken': create_access_token(identity=content['email'])}
        return make_response(jsonify(data), 201)
    except:
        data = {'message': 'Error', 'code': 'ERROR'}
        return make_response(jsonify(data), 400)


# Recupera senha
@app.route('/api/recovery', methods=['POST'])
def password_recovery():
    try:
        content = json.loads(request.data.decode())  # get the data received in a Flask request

        user = User.query.filter_by(email=content['email']).first()  # get user from db

        error_data = {'message': 'Incorrect email', 'code': 'Error'}

        # Checa se há email no Banco
        if user is None:
            return make_response(jsonify(error_data), 404)

        # Valida nome de esocla
        elif content['schoolName'] != user.schoolName:
            error_data = {'message': 'Incorrect answer', 'code': 'Error'}
            return make_response(jsonify(error_data), 404)

        # Retorna senha
        data = {'message': 'Login', 'code': 'SUCCESS', 'password': user.password}  
        return make_response(jsonify(data), 200)
    except Exception as e:
        print(e)
        data = {'message': 'Error', 'code': 'ERROR'}
    return make_response(jsonify(data), 400)


# Encerra sessão
@app.route('/api/logout', methods=['GET'])
@jwt_required()
def logout():
    try:
        jti = get_jwt()['jti']
        blacklist_jwt.add(jti)
        data = {'message': 'Logout', 'code': 'SUCCESS'}
        return make_response(jsonify(data), 200)
    except:
        data = {'message': 'Error', 'code': 'ERROR'}
        return make_response(jsonify(data), 400)


# Get notas
@app.route('/api/get/notes', methods=['GET'])
@jwt_required()
def get_notes():
    try:
        current_user = get_jwt_identity()  # get current user
        user_notes = Notes.query.filter_by(email=current_user).first()
        data = {'code': 'SUCCESS', 'notes': user_notes.notes}
        return make_response(jsonify(data), 200)
    except:
        data = {'message': 'Error', 'code': 'ERROR'}
        return make_response(jsonify(data), 400)


# Post notas
@app.route('/api/add/note', methods=['POST'])
@jwt_required()
def add_note():
    try:
        # Pega dados da requisição
        content = json.loads(request.data.decode())
        # Localiza usuário da requisição
        current_user = get_jwt_identity() 
        user_notes = Notes.query.filter_by(email=current_user).first()

        new_notes = [content]
        for item in user_notes.notes:
            new_notes.append(item)

        user_notes.notes = new_notes
        db.session.commit()

        data = {'message': 'Added', 'code': 'SUCCESS'}
        return make_response(jsonify(data), 200)
    except:
        data = {'message': 'Error', 'code': 'ERROR'}
        return make_response(jsonify(data), 400)


# Delete nota
@app.route('/api/delete/note', methods=['POST'])
@jwt_required()
def delete_note():
    try:
        # Pega dados da requisição
        content = json.loads(request.data.decode())
        current_user = get_jwt_identity() 
        # Localiza usuário da requisição
        user_notes = Notes.query.filter_by(email=current_user).first()
        new_notes = list(filter(lambda item: item != content, user_notes.notes))  # filter note

        user_notes.notes = new_notes
        db.session.commit()

        data = {'message': 'Deleted', 'code': 'SUCCESS'}
        return make_response(jsonify(data), 200)
    except:
        data = {'message': 'Error', 'code': 'ERROR'}
        return make_response(jsonify(data), 400)


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist_jwt


@jwt.expired_token_loader
def my_expired_token_callback(expired_token):
    data = {'message': 'expired_token', 'code': 'ERROR'}
    return make_response(jsonify(data), 401)


@jwt.invalid_token_loader
def my_invalid_token_callback(invalid_token):
    data = {'message': 'invalid_token', 'code': 'ERROR'}
    return make_response(jsonify(data), 401)


@app.errorhandler(404)
def not_found(error):
    data = {'message': 'Not Found', 'code': 'ERROR'}
    return make_response(jsonify(data), 400)


# Cria Banco de Dados se não existir
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4000, debug=True)
