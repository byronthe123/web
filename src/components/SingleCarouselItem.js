import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle } from "reactstrap";

const SingleCarouselItem = ({ title, img, category, detail, badges }) => {
    return (
      <div className="glide-item">
        <Card className="flex-row">
          <img
            className="list-thumbnail responsive border-0 card-img-left"
            src={img}
            alt={title}
          />
          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
            <CardBody className="align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
              <p className="list-item-heading mb-1 truncate">{title}</p>
              <p className="mb-0 text-muted text-small">{category}</p>
              <p className="mb-0 text-muted text-small">{detail}</p>
              <div>
                {badges &&
                  badges.map((b, index) => {
                    return (
                      <span
                        key={index}
                        className={`badge badge-pill badge-${b.color} ${index <
                          badges.length && "mr-1"}`}
                      >{b.title}
                      </span>
                    );
                  })}
              </div>
            </CardBody>
          </div>
        </Card>
      </div>
    );
  };

  export default SingleCarouselItem;