import React from "react";
import "./App.css";
import axios from "axios";
import DisplayWeather from "./components/DisplayWeather";
import Navbar from "./components/Navbar";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: {
        name: "",
        status: "",
        regionName: "",
        country: "",
      },
      data: {},
      inputData: "",
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    };
  }
  componentDidMount() {
    (() => {
      axios
        .get("http://ip-api.com/json")
        .then((resp) => {
          let loc = {
            name: resp.data.city,
            status: resp.data.status,
            regionName: resp.data.regionName,
            country: resp.data.country,
          };
          this.setState({ city: loc });

          if (this.state.city.status === "success") {
            axios
              .get(
                `http://api.weatherstack.com/current?access_key=9b589bec07539a0a2aac5836fb5c6906&query=${this.state.city.name}`
              )
              .then((response) => {
                console.log(response);
                let weatherData = {
                  location: this.state.city.name,
                  temperature: response.data.current.temperature,
                  description: response.data.current.weather_descriptions[0],
                  region: this.state.city.regionName,
                  country: this.state.city.country,
                  wind_speed: response.data.current.wind_speed,
                  pressure: response.data.current.pressure,
                  precip: response.data.current.precip,
                  humidity: response.data.current.humidity,
                  img: response.data.current.weather_icons,
                };

                this.setState({ data: weatherData });
              })
              .catch((error) => console.log(error.message));
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    })();
  }

  //track input field
  change = (value) => {
    //console.log("Changing")
    this.setState({ inputData: value });
  };

  changeWeather = (event) => {
    event.preventDefault();
    //api call
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=9b589bec07539a0a2aac5836fb5c6906&query=${this.state.inputData}`
      )
      .then((response) => {
        //console.log(response)
        let weatherData = {
          location: response.data.location.name,
          temperature: response.data.current.temperature,
          description: response.data.current.weather_descriptions[0],
          region: response.data.location.region,
          country: response.data.location.country,
          wind_speed: response.data.current.wind_speed,
          pressure: response.data.current.pressure,
          precip: response.data.current.precip,
          humidity: response.data.current.humidity,
          img: response.data.current.weather_icons,
        };

        this.setState({ data: weatherData });
      })
      .catch((error) => console.log(error.message));
  };

  render() {
    return (
      <div className="App">
        <Navbar changeRegion={this.change} changeWeather={this.changeWeather} />
        <div className="container">
          <DisplayWeather weather={this.state.data} />
        </div>
      </div>
    );
  }
}

export default App;
