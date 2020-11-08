import "./App.css";
import React from "react";
import { Component } from "react";
import Webcam from "react-webcam";

export default class ImageCapture extends Component {
  constructor(props) {
    super(props);
    this.state = { screenshot: null, labels: null, faces: null };
  }

  saveImg(image) {
    // POST request to /saveImg to get the labels from the screenshot
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"base64str":image}),
    };
    fetch("http://localhost:8000/saveImg", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ labels: json.data });
      });

    // GET request to /getImgs to get the faces
    const requestOptions2 = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("http://localhost:8000/getImgs", requestOptions2)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ faces: json.data });
      });
  }

  screenshot() {
    // access the webcam trough this.refs
    var screenshot = this.refs.webcam.getScreenshot();
    console.log(screenshot);
    this.setState({ screenshot: screenshot });
    this.saveImg(screenshot);
  }

  showFaces() {
    
    console.log(this.state.faces)
    console.log(this.state.labels)

    if(this.state.faces != null && this.state.labels != null)
    {
      let elements = []
    for (var i = 0; i < (this.state.labels).length; i++) {
      
      console.log(i)
      let labelStr = "";

      if (this.state.labels[i].label == "FaceTrainingSet") {
        labelStr = "No mask";
      } else {
        labelStr = "Mask";
      }
      elements.push(
        <div>
          <img src={"data:image/jpg;base64," + this.state.faces[i]} />
          {labelStr}
          {"confidence: " + this.state.labels[i].confidence}
        </div>)
      
    }
    return elements
  }
  }

  render() {
    return (
      <div>
        <Webcam screenshotFormat={"image/png"} audio={false} ref="webcam" />
        <button onClick={this.screenshot.bind(this)}>Capture Image</button>
        <button onClick={this.showFaces.bind(this)}>Show Faces</button>
        {this.state.screenshot ? <img src={this.state.screenshot} /> : null}
        {this.state.labels ? this.showFaces() : null}
        
      </div>
    );
  }
}
