import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth';


const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
    const authLinks = (
        <ul>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user">
                        <span className="hide-mobile">
                            Developers
                        </span>
                    </i>
                </Link>
            </li>

            <li>
                <a onClick={logout} href="#!">
                    <i className="fas fa-sign-out-alt">
                        <span className="hide-mobile">
                            Logout
                        </span>
                    </i>
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li><Link to="#!">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>

    )

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    )
}


Navbar.prototype = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateTopProps = state => ({
    auth: state.auth
})


export default connect(mapStateTopProps, { logout })(Navbar) 
