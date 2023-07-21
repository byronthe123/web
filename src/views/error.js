import React, { Component, Fragment, useState, useEffect } from "react";
import { Row, Card, CardTitle,Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../components/common/CustomBootstrap";


const Error = (props) => {

    const [message, setMessage] = useState('Page Not Found');
    const [errorCode, setErrorCode] = useState(404);

    useEffect(() => {
        document.body.classList.add("background");
        const { location, errorCode } = props;

        if ((location && location.pathname === '/error/401') || errorCode === 401) {
            setMessage('Unauthorized');
            setErrorCode(401);
        }
        return () => {
            document.body.classList.remove("background");
        }
    }, [props]);

    return (
        <Fragment>
        <div className="fixed-background" />
        <main>
          <div className="container">
            <Row className="h-100 test">
              <Colxx xxs="12" md="6" className="mx-auto my-auto">
                <Card className="auth-card">
                  <div className="position-relative image-side" style={{backgroundImage: 'url(/assets/img/login.jpg)', backgroundSize: '  ', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderRadius: '0.75rem'}}></div>
                  <div className="form-side">
                    <NavLink to={`/`} className="white">
                      <span className="logo-single" />
                    </NavLink>
                    <div className="mb-4" style={{ width:  '200px'}}>
                        <h2>
                        {
                            message
                        }
                        </h2>
                    </div>
                    <p className="display-1 font-weight-bold mb-5">{errorCode}</p>
                    <Button
                      href="/"
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      Return Home
                    </Button>
                    {/* <Button 
                        onClick={() => props.logout()}
                        className="btn-shadow mt-2"
                    >
                        Logout
                    </Button> */}
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
}
export default Error;
