import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {
    name: state.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateName: name => dispatch({
      type: "UPDATE_NAME",
      name
    })
  }
}

class Avatar extends Component {
  state = {
    photo: "https://avatars2.githubusercontent.com/u/6332287?s=400&u=362e612b8b6fb36b50f62b7499a41f95ddc92ee7&v=4"
  }

  componentDidMount() {
    fetch("https://uinames.com/api/?ext")
      .then(response => response.json())
      .then(response => {
        this.setState({ photo: response.photo })
        this.props.updateName(response.name)
      })
  }

  render() {
    return (
      <Image source={{ uri: this.state.photo }} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Avatar)

const Image = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
`