import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Accordion,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
import "./GuessTheMovie_App_Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { movies } from "./static_data";

/**
 * GUESS THE LETTERS - btnLetterGuess
 * GUESS THE MOVIE - btnMovieGuess
 * I GIVE UP/NEXT - btnAnswer/btnNext
 */

export class GuessTheMovie_App_Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      currentIndex: 0,
      movieName: "",
      toggleButton: "answer", //toggle it between "answer" and "next",
      attempts: 0,
      txtLetterGuess: "",
      txtMovieGuess: "",
      letterGuessIsCorrect: null,
      movieGuessIsCorrect: null,
      correctlyGuessedLetters: []
    };

    this.btnAnswer_btnNext = this.btnAnswer_btnNext.bind(this);
    this.btnLetterGuess = this.btnLetterGuess.bind(this);
    this.btnMovieGuess = this.btnMovieGuess.bind(this);
  }

  componentDidMount() {
    //make API request to fetch a list of movies

    // axios
    //   .get(
    //     "https://api.themoviedb.org/3/movie/popular?api_key=b08986608f2b838f8dc89c7c21bee0ea&language=en-US&page=1"
    //   )
    //   .then((response) => {
    //     let temp = response.data.results.map((each) => {
    //       return {
    //         name: each.title,
    //         hint: each.overview,
    //       };
    //     });
    //     this.setState({
    //       movies: temp,
    //       attempts: this.getAttempts(temp[0].name),
    //     });
    //   })
    //   .catch((error) => console.log(error));

    this.setState({
      movies: movies,
      attempts: this.getAttempts(movies[0].name)
    });
  }

  isVowel(charac) {
    if (["a", "e", "i", "o", "u"].includes(charac.toLowerCase())) return true;
    return false;
  }

  getAttempts(movieName) {
    let consonants = 0;
    Array.from(movieName).map((each) => {
      if (!this.isVowel(each) && each !== " ") consonants++;
    });
    return Math.floor(consonants / 2);
  }

  btnLetterGuess() {
    /**
     * Restrict user to type only one letter [DONE]
     * when guess is clicked
     *  1. show icon correct or wrong based on whether guessed letter belongs to movie name or not[DONE]
     *  2. decrease no. of attempts[DONE]
     *  3. emanate correct or wrong guess sound [optional]
     *  4. if guess is correct reveal that letter in the movie name string[DONE]
     *  5. when attempts are zero, disable guess button[DONE]
     */
    let {
      movies,
      currentIndex,
      txtLetterGuess,
      attempts,
      correctlyGuessedLetters
    } = this.state;
    let movieName = Array.from(movies[currentIndex].name.toLowerCase());
    movieName = movieName.filter((each) => !this.isVowel(each));
    let letter = txtLetterGuess.toLowerCase();

    if (movieName.includes(letter)) {
      this.setState({
        letterGuessIsCorrect: true,
        correctlyGuessedLetters: [...correctlyGuessedLetters, letter]
      });
    } else if (txtLetterGuess === "")
      this.setState({ letterGuessIsCorrect: null });
    else {
      this.setState({
        letterGuessIsCorrect: false
      });
    }
  }

  btnMovieGuess() {
    /**
     * If movie is correct, then
     *  1. show correct icon else wrong icon
     *  2. show complete movie name
     *  3. show next button
     */
    let {
      movies,
      currentIndex,
      txtMovieGuess,
      movieGuessIsCorrect,
      movieName
    } = this.state;
    if (
      movies[currentIndex].name.toLowerCase() === txtMovieGuess.toLowerCase()
    ) {
      this.setState({
        movieGuessIsCorrect: true,
        movieName: movies[currentIndex].name,
        toggleButton: "next"
      });
    } else {
      this.setState({
        movieGuessIsCorrect: false
      });
    }
  }

  btnAnswer_btnNext() {
    let { movies, currentIndex, toggleButton } = this.state;

    if (toggleButton === "answer") {
      //when "I GIVE UP" button is clicked
      this.setState({
        movieName: movies[currentIndex].name,
        toggleButton: "next",
        letterGuessIsCorrect: null,
        movieGuessIsCorrect: null,
        correctlyGuessedLetters: [],
        attempts: this.getAttempts(movies[currentIndex].name)
      });
    } else {
      //when "NEXT" button is clicked
      this.setState({
        movieName: "",
        txtLetterGuess: "",
        txtMovieGuess: "",
        movieGuessIsCorrect: null,
        letterGuessIsCorrect: null,
        correctlyGuessedLetters: [],
        currentIndex: (currentIndex + 1) % movies.length,
        toggleButton: "answer",
        attempts: this.getAttempts(
          movies[(currentIndex + 1) % movies.length].name
        )
      });
    }
  }

  render() {
    let {
      movieName,
      toggleButton,
      currentIndex,
      movies,
      letterGuessIsCorrect,
      movieGuessIsCorrect,
      attempts,
      txtLetterGuess,
      txtMovieGuess,
      correctlyGuessedLetters
    } = this.state;
    return (
      <Container>
        <Row style={{ justifyContent: "center", marginBottom: "50px" }}>
          <h1>GUESS THE MOVIE</h1>
        </Row>
        <Row id="movie_text">
          {movieName ? (
            <span>{movieName}</span>
          ) : (
            movies.length > 0 &&
            Array.from(movies[currentIndex].name).map((each) => {
              if (this.isVowel(each))
                return <span className="vowel">{each}</span>;
              else if (each === " ")
                return <span className="space">{each}</span>;
              else if (
                correctlyGuessedLetters.length > 0 &&
                correctlyGuessedLetters.includes(each.toLowerCase())
              )
                return <span>{each}</span>;
              else return <span>_</span>;
            })
          )}
        </Row>
        <Row sm={7} style={{ justifyContent: "center" }}>
          <Col sm={6}>
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    GUESS THE LETTERS
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <div>
                      <div>
                        <span>Attempts: </span>
                        <span>{this.state.attempts}</span>
                      </div>
                      <Container>
                        <Row>
                          <Col>
                            <InputGroup>
                              <FormControl
                                placeholder="Your Guess"
                                aria-label="Your Guess"
                                maxLength="1"
                                value={txtLetterGuess}
                                disabled={attempts === 0 ? true : false}
                                onChange={(e) => {
                                  this.setState(
                                    {
                                      txtLetterGuess: e.target.value,
                                      attempts:
                                        e.target.value === ""
                                          ? attempts
                                          : attempts - 1,
                                      letterGuessIsCorrect:
                                        e.target.value === ""
                                          ? null
                                          : letterGuessIsCorrect
                                    },
                                    () => {
                                      this.btnLetterGuess();
                                    }
                                  );
                                }}
                              />
                            </InputGroup>
                          </Col>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {letterGuessIsCorrect === null ? (
                              ""
                            ) : letterGuessIsCorrect === true ? (
                              <FontAwesomeIcon icon={faCheckCircle} />
                            ) : (
                              <FontAwesomeIcon icon={faTimesCircle} />
                            )}
                          </div>
                        </Row>
                      </Container>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    GUESS THE MOVIE
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <Container>
                      <Row>
                        <Col>
                          <InputGroup>
                            <FormControl
                              placeholder="Your Guess"
                              aria-label="Your Guess"
                              value={txtMovieGuess}
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                this.setState({ txtMovieGuess: e.target.value })
                              }
                            />
                            <InputGroup.Append
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <Button
                                variant="outline-secondary"
                                onClick={this.btnMovieGuess}
                                style={{ marginTop: "10px" }}
                              >
                                GUESS
                              </Button>
                            </InputGroup.Append>
                          </InputGroup>
                        </Col>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {movieGuessIsCorrect === null ? (
                            ""
                          ) : movieGuessIsCorrect === true ? (
                            <FontAwesomeIcon icon={faCheckCircle} />
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} />
                          )}
                        </div>
                      </Row>
                    </Container>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Button
              style={{ marginTop: "10px" }}
              onClick={this.btnAnswer_btnNext}
            >
              {toggleButton === "next" ? "NEXT" : "I GIVE UP :("}
            </Button>
          </Col>

          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={
              <Popover id="popover-basic">
                <Popover.Title as="h3">Hint</Popover.Title>
                <Popover.Content>
                  {movies.length > 0 && movies[currentIndex].hint}
                </Popover.Content>
              </Popover>
            }
          >
            <Button variant="success">
              <img
                src="https://jooinn.com/images/light-bulb-ideas.jpg"
                style={{ height: "40px", objectFit: "contain" }}
              />
            </Button>
          </OverlayTrigger>
        </Row>
      </Container>
    );
  }
}

/**
 *
 * Functionalities
 * 1. Iterate over the list of movies stored locally and show vowels only of each movie one by one[DONE]
 * 2. Code functionalities for letter guess, movie guess and [I give up][DONE] buttons
 * 3. Show hints
 * 4. Fetch data from an API
 * 5. Calculate attempts for each movie name as (no. of consonants)/2 [DONE]
 */
