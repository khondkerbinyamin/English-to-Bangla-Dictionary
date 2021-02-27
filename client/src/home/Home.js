import React, { useState } from 'react';
import './Home.css';
import Axios from 'axios'
import {serverUrl} from '../util';
import { Form, FormControl, Button, Container } from 'react-bootstrap';

function serverQuery(searchText, setResultText){  //function to transfer data to backend
  Axios
  .get(`${serverUrl}/dictionary?word=${searchText}`)
  .then(({data: res}) => {
      console.log(res);
      setResultText(res);
  })
  .catch((error) => {
      console.error(error);
      console.log('failed to load result');
  });
}

function Home() {
  const [searchText, setSearchText] = useState();
  const [resultText, setResultText] = useState();

  function parseSearchText(e){
      setSearchText(e.target.value);
  }

  function handleSubmit(e) {
      e.preventDefault();
      serverQuery(searchText, setResultText);
  }

  return (
    <Container className="HomeContainer" fluid="md">
        <div className="Title">
            English to Bangla Dictionary
        </div>

        <div className="FormDiv">
          <Form className="Form" onSubmit={handleSubmit}>
            <div>
              <Form.Control className="FormControl" type="text" placeholder="Enter a word" 
                onChange={parseSearchText}/>
              <Button className="FormButton" variant="outline-danger" type="submit">Translate</Button>
            </div>
          </Form>
        </div>

        <div className="resultDiv">
          {resultText &&  // only renders when the resultText is not null
              <div className="banglaTitle">Bangla Meaning:</div>
          }
          <div>
              {resultText}
          </div>
        </div>
    </Container>

  );
}

export default Home;
