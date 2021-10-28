import Styles from './header.module.scss';

function header() {
    return (
        <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
            <nav className="uk-navbar-container uk-padding-small" uk-navbar="true">
                <div className={Styles.navItem}>
                    <button className="uk-button uk-button-link" onClick={() => console.log('hoho')}>Sign in</button>
                </div>
            </nav>
        </div>
    )
}

export default header;