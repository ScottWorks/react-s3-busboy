import React, { Component } from 'react';
import axios from 'axios';

class FileUploader extends Component {
  constructor() {
    super();
    this.state = {
      data: ''
    };

    this.handleObject = this.handleObject.bind(this);
    this.sendObjectToS3 = this.sendObjectToS3.bind(this);
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  handleObject(e) {
    let data = new FormData(this.form);

    this.setState({
      data: data
    });
  }

  sendObjectToS3(e) {
    e.preventDefault();
    const { data } = this.state;

    axios.post('/api/uploadObject', data).then((s3response) => {
      this.setState({
        data: ''
      });
      console.log(s3response);
      alert(s3response.data.msg);
    });
  }

  render() {
    return (
      <div style={{ padding: '250px' }}>
        <form ref={(e) => (this.form = e)}>
          <input type="file" name="file-input" onChange={this.handleObject} />
          <button onClick={this.sendObjectToS3}>Upload To S3!</button>
        </form>
      </div>
    );
  }
}

export default FileUploader;
