import { Component } from "react";
import React from "react";
import moment from "moment";
import axios from "axios";
import {
  Layout,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  Button,
  message,
  Avatar,
  List,
  Space,
} from "antd";
import { HeartOutlined, RetweetOutlined } from "@ant-design/icons";
import { countries } from "country-city-location";
var languages = require("language-list")();

const { Content, Footer } = Layout;
const { Search } = Input;
const { Option } = Select;

const languageData = languages.getData();

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

class SearchEngine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      date: "",
      country: "",
      language: "",
      tweetCount: "",
      listData: [],
    };

    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.disabledDate = this.disabledDate.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleTweetCountChange = this.handleTweetCountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeywordChange(e) {
    this.setState({ searchText: e.target.value });
  }

  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  handleDateChange(e) {
    this.setState({ date: e });
  }

  handleCountryChange(e) {
    this.setState({ country: e });
  }

  handleLanguageChange(e) {
    this.setState({ language: e });
  }

  handleTweetCountChange(e) {
    this.setState({ tweetCount: e });
  }

  handleSubmit(e) {
    if (
      this.state.searchText !== "" &&
      this.state.date !== "" &&
      this.state.country !== "" &&
      this.state.language !== "" &&
      this.state.tweetCount !== ""
    ) {
      const formData = {
        searchText: this.state.searchText,
        date: this.state.date,
        country: this.state.country,
        language: this.state.language,
        tweetCount: this.state.tweetCount,
      };
      axios
        .request({
          method: "post",
          url: "http://localhost:5000/tweets",
          data: formData,
        })
        .then((response) => {
          const data = response.data;
          this.setState({ listData: [] });
          for (let i = 0; i < data["description"].length; i++) {
            this.setState((prevState) => ({
              listData: [
                ...prevState.listData,
                {
                  name: data["name"][i],
                  href: "https://twitter.com/" + data["screen_name"][i],
                  screen_name: data["screen_name"][i],
                  profile_image_url: data["profile_image_url"][i],
                  description: data["description"][i],
                  following: data["following"][i],
                  followers: data["followers"][i],
                  texts: data["tweet"][i],
                  likes_count: data["likes_count"][i],
                  retweet_count: data["retweet_count"][i],
                },
              ],
            }));
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else {
      message.error("Please fill all inputs");
    }
  }

  render() {
    return (
      <div>
        <Layout>
          <div className="text-wrapper">REAL TIME TWEET LOOKUP</div>
          <Content>
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Col span={24} xs={24} md={24}>
                <Search
                  placeholder="Enter tweet search keywords"
                  onChange={this.handleKeywordChange}
                  style={{
                    width: 400,
                    height: 150,
                    paddingTop: "70px",
                    paddingBottom: "50px",
                  }}
                  size="large"
                />
              </Col>
            </Row>
            <Row
              gutter={[24, 24]}
              style={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Col span={6} xs={24} md={6}>
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={this.disabledDate}
                  onChange={this.handleDateChange}
                  placeholder="Select date from when you want tweets"
                  style={{ width: 300 }}
                />
              </Col>
              <Col span={6} xs={24} md={6}>
                <Select
                  showSearch
                  placeholder="Select the country of tweet origin"
                  style={{ width: 300 }}
                  onChange={this.handleCountryChange}
                >
                  {countries.map((item) => (
                    <Option key={item.Alpha2Code} value={item.Name}>
                      {item.Name}
                    </Option>
                  ))}{" "}
                </Select>
              </Col>
              <Col span={6} xs={24} md={6}>
                <Select
                  showSearch
                  placeholder="Select the language of tweet"
                  style={{ width: 300 }}
                  onChange={this.handleLanguageChange}
                >
                  {languageData.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.language}
                    </Option>
                  ))}{" "}
                </Select>
              </Col>
              <Col span={6} xs={24} md={6}>
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Select the number of tweets"
                  onChange={this.handleTweetCountChange}
                >
                  <Option value="1">One (1)</Option>
                  <Option value="5">Five (5)</Option>
                  <Option value="10">Ten (10)</Option>
                  <Option value="20">Twenty (20)</Option>
                  <Option value="50">Fifty (50)</Option>
                  <Option value="100">Hundred (100)</Option>
                </Select>
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "30px",
              }}
            >
              <Col span={24} xs={24} md={24}>
                <Button
                  style={{ color: "black" }}
                  type="primary"
                  onClick={this.handleSubmit}
                >
                  SEARCH
                </Button>
              </Col>{" "}
            </Row>
            <Row>
              <Col span={24}>
                <div
                  style={{
                    paddingTop: "50px",
                    fontSize: "20px",
                    width: "1300px",
                    paddingLeft: "300px",
                  }}
                >
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      pageSize: 3,
                    }}
                    dataSource={this.state.listData}
                    renderItem={(item) => (
                      <List.Item
                        key={item.name}
                        actions={[
                          <IconText
                            icon={HeartOutlined}
                            text={item.likes_count}
                            key="list-vertical-star-o"
                          />,
                          <IconText
                            icon={RetweetOutlined}
                            text={item.retweet_count}
                            key="list-vertical-like-o"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar size={64} src={item.profile_image_url} />
                          }
                          title={<a href={item.href}>{item.name}</a>}
                          description={
                            <div>
                              <p>{`
                            @${item.screen_name}
                            `}</p>
                              <p>{`
                            Following:
                            ${item.following}
                            Followers:
                            ${item.followers}`}</p>
                            </div>
                          }
                        />
                        {item.texts}
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
            </Row>
          </Content>
          <Footer></Footer>
        </Layout>
      </div>
    );
  }
}

export default SearchEngine;
