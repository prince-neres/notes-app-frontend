import React from 'react'
import { Route, Redirect } from 'react-router-dom'


const PrivateRoute = ({isLogged, component: Component, ...rest}) => {
    return (
        // Mostra componente somente se usuário estiver logado ao contrário rediciona-o para página de login
        <Route {...rest} render={props => (
            isLogged
            ? <Component {...props} />
            : <Redirect to='/login' />
        )} />
    )
}

export default PrivateRoute