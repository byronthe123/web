import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from "react-dom";

class LocationUtil {
    redirect(url) {
      window.location.assign(url);
      // return a never resolving promise to wait for location change
      return new Promise(() => undefined);
    }
  
    parseHashParams(hashstring) {
      return this.parseParams(hashstring.substring(1));
    }
  
    parseParams(querystring) {
      // parse query string
      return new URLSearchParams(querystring);
    }
  }
  
  class Encoder {
    stringify(obj) {
      if (typeof obj !== "object") {
        return encodeURIComponent(obj);
      }
  
      const str = [];
      Object.keys(obj || {}).forEach((key) => {
        let value = obj[key];
        if (value !== "" && value !== undefined) {
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          str.push([key, value].map(encodeURIComponent).join("="));
        }
      });
  
      return str.join("&");
    }
  }
  
  class OAuth {
    constructor({
      clientId,
      redirectUri = window.location.origin,
      oauthHost = "https://authentication.logmeininc.com",
    }) {
      this.clientId = clientId;
      this.redirectUri = redirectUri;
      this.oauthHost = oauthHost;
  
      // Local Classes
      this.encoder = new Encoder();
      this.locationUtil = new LocationUtil();
    }
  
    async getToken() {
      const params = this.locationUtil.parseHashParams(window.location.hash);
      const token = params.get("access_token");
      if (token) {
        return token;
      }
  
      return this.implicit();
    }
  
    async implicit() {
      const params = {
        client_id: this.clientId,
        response_type: "token",
        redirect_uri: this.redirectUri,
      };
      console.log(params);
      console.log();
      window.open(`${this.oauthHost}/oauth/authorize?${this.encoder.stringify(params)}`);
      //   return this.locationUtil.redirect(
    //     `${this.oauthHost}/oauth/authorize?${this.encoder.stringify(params)}`
    //   );
    }
  }

  
  const RenderInWindow = (props) => {
    const [container, setContainer] = useState(null);
    const newWindow = useRef(window);
    
    useEffect(() => {
      const div = document.createElement("div");
      setContainer(div);
    }, []);
  
    useEffect(() => {
      if (container) {
        const getToken = async () => {
            const auth = new OAuth({
                // Add Client Info
                clientId: "0929bc52-dd3a-4750-8d47-19621799c1e2",
            });
            const token = await auth.getToken();
    
            console.log(token);
        }
        newWindow.current = window.open(
          "",
          "",
          "width=600,height=400,left=200,top=200"
        );
        if (newWindow.current) {
            document.body.appendChild(container);
            getToken();
        }
        
        const curWindow = newWindow.current;

        return () => curWindow.close();
      }
    }, [container]);


    return container && createPortal(props.children, container);
  };

export default function GoTo () {

    return (
        <>
        <h1>test</h1>
        <RenderInWindow>hello world</RenderInWindow>
        </>
    );
}