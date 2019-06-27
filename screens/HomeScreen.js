import React, { Component } from 'react'
import { Animated, Easing, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const CardsQuery = gql`
  {
    cardsCollection {
      items {
        title
        subtitle
        image {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        caption
        logo {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        content
      }
    }
  }
`

import Card from '../components/Card'
import { NotificationIcon } from '../components/Icons'
import Logo from '../components/Logo'
import Course from '../components/Course'
import Menu from '../components/Menu'
import Avatar from '../components/Avatar'
import { Query } from 'react-apollo';

function mapStateToProps(state) {
  return {
    action: state.action,
    name: state.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch({
      type: "OPEN_MENU"
    })
  }
}

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1)
  }

  componentDidMount() {
    StatusBar.setBarStyle("dark-content", true)
  }

  componentDidUpdate() {
    this.toggleMenu()
  }

  toggleMenu = () => {
    if (this.props.action == "openMenu") {
      Animated.timing(this.state.scale, {
        toValue: 0.9,
        duration: 300,
        easing: Easing.in()
      }).start()
      Animated.spring(this.state.opacity, {
        toValue: 0.5
      }).start()

      StatusBar.setBarStyle("light-content", true)
    }

    if (this.props.action == "closeMenu") {
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 300,
        easing: Easing.in()
      }).start()
      Animated.spring(this.state.opacity, {
        toValue: 1
      }).start()

      StatusBar.setBarStyle("dark-content", true)
    }
  }

  render() {
    return (
      <RootView>
        <Menu />
        <AnimatedContainer style={{ transform: [{ scale: this.state.scale }], opacity: this.state.opacity }}>
          <SafeAreaView>
            <ScrollView style={{ height: "100%" }}>
              <TitleBar>
                <TouchableOpacity 
                  onPress={this.props.openMenu} 
                  style={{ position: "absolute", top: 0, left: 20 }}
                >
                  <Avatar />
                </TouchableOpacity>
                <Title>Welcome back,</Title>
                <Name>{this.props.name}</Name>
                <NotificationIcon style={{ position: "absolute", right: 20, top: 5 }} />
              </TitleBar>
              <ScrollView
                horizontal={true}
                style={{ flexDirection: "row", padding: 20, paddingLeft: 12, paddingTop: 30 }}
                showsHorizontalScrollIndicator={false}
              >
                {
                  logos.map((logo, index) => (
                    <Logo key={index} image={logo.image} text={logo.text} />
                  ))
                }
              </ScrollView>
              <Subtitle>Continue Learning</Subtitle>
              <ScrollView
                horizontal={true}
                style={{ paddingBottom: 30 }}
                showsHorizontalScrollIndicator={false}
              >
                <Query query={CardsQuery}>
                  {
                    ({ loading, error, data }) => {
                      if (loading) return <Message>Loading...</Message>
                      if (error) return <Message>Error...</Message>
                      return (
                        <CardsContainer>
                          {
                            data.cardsCollection.items.map((card, index) => (
                              <TouchableOpacity key={index} onPress={() => {
                                this.props.navigation.push("Section", {
                                  section: card
                                })
                              }}>
                                <Card
                                  title={card.title}
                                  image={card.image}
                                  caption={card.caption}
                                  logo={card.logo}
                                  subtitle={card.subtitle}
                                  content={card.content}
                                />
                              </TouchableOpacity>
                            ))
                          }
                        </CardsContainer>
                      )
                    }
                  }
                </Query>
              </ScrollView>
              <Subtitle>Popular Courses</Subtitle>
              {
                courses.map((course, index) => (
                  <Course
                    key={index}
                    image={course.image}
                    title={course.title}
                    subtitle={course.subtitle}
                    logo={course.logo}
                    author={course.author}
                    avatar={course.avatar}
                    caption={course.caption}
                  />
                ))
              }
            </ScrollView>
          </SafeAreaView>
        </AnimatedContainer>
      </RootView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const RootView = styled.View`
  background: black;
  flex: 1;
`

const Message = styled.Text`
  margin: 20px;
  color: #b8bece;
  font-size: 15px;
  font-weight: 500;
`

const CardsContainer = styled.View`
  flex-direction: row;
`

const Container = styled.View`
  flex: 1;
  background-color: #f0f3f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const AnimatedContainer = Animated.createAnimatedComponent(Container)

const Name = styled.Text`
  font-size: 20px;
  color: #3c4560;
  font-weight: bold;
`

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`

const Title = styled.Text`
  font-size: 16px;
  color: #b8bece;
  font-weight: 500;
`

const TitleBar = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-left: 80px;
`

const logos = [
  {
    image: require('../assets/logo-framerx.png'),
    text: "Framer X"
  },
  {
    image: require('../assets/logo-figma.png'),
    text: "Figma"
  },
  {
    image: require('../assets/logo-studio.png'),
    text: "Studio"
  },
  {
    image: require('../assets/logo-react.png'),
    text: "React"
  },
  {
    image: require('../assets/logo-swift.png'),
    text: "Swift"
  },
  {
    image: require('../assets/logo-sketch.png'),
    text: "Sketch"
  },
]

const courses = [
  {
    title: "Prototype in InVision Studio",
    subtitle: "10 sections",
    image: require('../assets/background13.jpg'),
    logo: require('../assets/logo-studio.png'),
    author: "Harold Portocarrero",
    avatar: require('../assets/avatar.jpg'),
    caption: "Design and interactive prototype"
  },
  {
    title: "React for Designers",
    subtitle: "12 sections",
    image: require('../assets/background11.jpg'),
    logo: require('../assets/logo-react.png'),
    author: "Harold Portocarrero",
    avatar: require('../assets/avatar.jpg'),
    caption: "Learn to design and code a React site"
  },
  {
    title: "Design an Code with Framer X",
    subtitle: "10 sections",
    image: require('../assets/background14.jpg'),
    logo: require('../assets/logo-framerx.png'),
    author: "Harold Portocarrero",
    avatar: require('../assets/avatar.jpg'),
    caption: "Create powerful design and code components for your app"
  },
  {
    title: "Design System in Figma",
    subtitle: "10 sections",
    image: require('../assets/background6.jpg'),
    logo: require('../assets/logo-figma.png'),
    author: "Harold Portocarrero",
    avatar: require('../assets/avatar.jpg'),
    caption: "Complete guide to designing a site using a collaborative design tool"
  },
]