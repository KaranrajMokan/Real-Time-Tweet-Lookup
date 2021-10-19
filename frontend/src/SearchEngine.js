import { Component } from "react";
import moment from "moment";
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
} from "antd";
import { countries } from "country-city-location";
var languages = require("language-list")();

const { Content, Footer } = Layout;
const { Search } = Input;
const { Option } = Select;

const languageData = languages.getData();

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: "https://ant.design",
    title: `ant design part ${i}`,
    avatar: "https://joeschmoe.io/api/v1/random",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  });
}

class SearchEngine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      date: "",
      country: "",
      language: "",
      tweetCount: "",
      commentCount: "",
      likesCount: "",
      retweetCount: "",
    };

    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.disabledDate = this.disabledDate.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleTweetCountChange = this.handleTweetCountChange.bind(this);
    this.handleCommentCountChange = this.handleCommentCountChange.bind(this);
    this.handleLikesCountChange = this.handleLikesCountChange.bind(this);
    this.handleRetweetCountChange = this.handleRetweetCountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeywordChange(e) {
    this.setState({ searchText: e });
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

  handleCommentCountChange(e) {
    this.setState({ commentCount: e });
  }

  handleLikesCountChange(e) {
    this.setState({ likesCount: e });
  }

  handleRetweetCountChange(e) {
    this.setState({ retweetCount: e });
  }

  handleSubmit(e) {
    if (
      this.state.searchText !== "" &&
      this.state.date !== "" &&
      this.state.country !== "" &&
      this.state.language !== "" &&
      this.state.tweetCount !== "" &&
      this.state.commentCount !== "" &&
      this.state.likesCount !== "" &&
      this.state.retweetCount !== ""
    ) {
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
              <Col span={8} xs={24} md={8}>
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={this.disabledDate}
                  onChange={this.handleDateChange}
                  placeholder="Select date from when you want tweets"
                  style={{ width: 300 }}
                />
              </Col>
              <Col span={8} xs={24} md={8}>
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
              <Col span={8} xs={24} md={8}>
                <Select
                  showSearch
                  placeholder="Select the language of tweet"
                  style={{ width: 300 }}
                  onChange={this.handleLanguageChange}
                >
                  {languageData.map((item) => (
                    <Option key={item.code} value={item.language}>
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
                  <Option value="10">Ten(10)</Option>
                  <Option value="20">Twenty(20)</Option>
                  <Option value="50">Fifty(50)</Option>
                  <Option value="100">Hundred(100)</Option>
                  <Option value="200">Two Hundred(200)</Option>
                  <Option value="500">Five Hundred(500)</Option>
                  <Option value="1000">Thousand(1000)</Option>
                </Select>
              </Col>
              <Col span={6} xs={24} md={6}>
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Select the number of comments"
                  onChange={this.handleCommentCountChange}
                >
                  <Option value="<10">Less than 10 (&lt;10)</Option>
                  <Option value="20-50">Twenty to Fifty(20-50)</Option>
                  <Option value="50-100">Fifty to One Hundred(50-100)</Option>
                  <Option value="100-200">
                    One Hundred to Two Hundred(100-200)
                  </Option>
                  <Option value="200-500">
                    Two Hundred to Five Hundred(200-500)
                  </Option>
                  <Option value="500-1000">
                    Five Hundred to Thousand(500-1000)
                  </Option>
                  <Option value=">1000">
                    Greater than One Thousand(&gt;1000)
                  </Option>
                </Select>
              </Col>
              <Col span={6} xs={24} md={6}>
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Select the number of likes"
                  onChange={this.handleLikesCountChange}
                >
                  <Option value="<10">Less than 10 (&lt;10)</Option>
                  <Option value="20-50">Twenty to Fifty(20-50)</Option>
                  <Option value="50-100">Fifty to One Hundred(50-100)</Option>
                  <Option value="100-200">
                    One Hundred to Two Hundred(100-200)
                  </Option>
                  <Option value="200-500">
                    Two Hundred to Five Hundred(200-500)
                  </Option>
                  <Option value="500-1000">
                    Five Hundred to Thousand(500-1000)
                  </Option>
                  <Option value=">1000">
                    Greater than One Thousand(&gt;1000)
                  </Option>
                </Select>
              </Col>
              <Col span={6} xs={24} md={6}>
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder="Select the number of retweets"
                  onChange={this.handleRetweetCountChange}
                >
                  <Option value="<10">Less than 10 (&lt;10)</Option>
                  <Option value="20-50">Twenty to Fifty(20-50)</Option>
                  <Option value="50-100">Fifty to One Hundred(50-100)</Option>
                  <Option value="100-200">
                    One Hundred to Two Hundred(100-200)
                  </Option>
                  <Option value="200-500">
                    Two Hundred to Five Hundred(200-500)
                  </Option>
                  <Option value="500-1000">
                    Five Hundred to Thousand(500-1000)
                  </Option>
                  <Option value=">1000">
                    Greater than One Thousand(&gt;1000)
                  </Option>
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
                    width: "1200px",
                    paddingLeft: "200px",
                  }}
                >
                  <List
                    itemLayout="vertical"
                    pagination={{
                      pageSize: 3,
                    }}
                    dataSource={listData}
                    renderItem={(item) => (
                      <List.Item
                        key={item.title}
                        extra={
                          <div>
                            <img
                              width={250}
                              style={{ paddingTop: "20px" }}
                              alt="logo"
                              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                          </div>
                        }
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.avatar} />}
                          title={<a href={item.href}>{item.title}</a>}
                          description={item.description}
                        />
                        {item.content}
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
