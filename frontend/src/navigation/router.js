import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import Registration from '../pages/Registration'
import PasswordRecovery from '../pages/PasswordRecovery'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import NavBar from '../component/NavBar'
import {useSelector} from 'react-redux'

function Router() {
    const auth = useSelector(state => state.auth_reducers)

    const Error = () => {
        return (
            <div>
                <h1>Bem vindo ao Aplicativo!</h1>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <NavBar/>
            <Switch>
                <PublicRoute isLogged={auth.isLogged} component={LoginPage} path='/login' exact/>
                <PublicRoute isLogged={auth.isLogged} component={Registration} path='/registration'/>
                <PublicRoute isLogged={auth.isLogged} component={PasswordRecovery} path='/recovery'/>
                <PrivateRoute isLogged={auth.isLogged} component={HomePage} path='/home'/>
                <Route component={Error}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Router
