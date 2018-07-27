import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Table, ControlLabel, FormControl,  FormGroup } from 'react-bootstrap'


const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table  striped>
      <tbody>
      {anecdotes.map(anecdote => 
          <tr key={anecdote.id} >
            <td>
              <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
            </td>
            <td>
              {anecdote.author}
            </td>
          </tr>
      )}
      </tbody>
    </Table>  
  </div>
)

const Anecdote = ({ anecdoteOne }) => {
  return (
    <div>
      <h2>{anecdoteOne.content} {' by '} {anecdoteOne.author}</h2>
      <div>
        {'has '}{anecdoteOne.votes} {' votes'}<br />
        {'for more info see '} <a href={`${anecdoteOne.info}`}>{anecdoteOne.info}</a><br />
      </div>
        <div>
          <br />
          <Footer />
        </div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    
    <em>An anecdote is a brief, revealing account of an individual person or an incident. 
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.
    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code. 
  </div>
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: ''
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
    this.props.history.push('/')
  }
  handleClick= (e) => {
    e.preventDefault()
  }

  render() {
    return(
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>
            content 
          </ControlLabel>
          <FormControl
            name='content' value={this.state.content} onChange={this.handleChange} 
           />
          
          <ControlLabel>
            author
          </ControlLabel>
          <FormControl
              name='author' value={this.state.author} onChange={this.handleChange} 
          />
          
          <ControlLabel>
            url for more info
            </ControlLabel>
            <FormControl
              name='info' value={this.state.info} onChange={this.handleChange} 
            />
           
          <button>create</button>
          </FormGroup>
        </form>
      </div>  
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: ''
    } 
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ 
      anecdotes: this.state.anecdotes.concat(anecdote),
      notification: 'a new anecdote ' + anecdote.content
     })
     setTimeout(() => {
       this.setState({
         notification: null
       })
     }, 5000);
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  render() {
    const notifColour = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16,
      border: 'solid',
      borderWidth: 0.5,
      padding: 5,
      borderRadius: 5,
      marginTop: 5
    }
    const menuColour = {
      fontSize: 20,
      background: 'lightBlue',
      padding: 10
    }
  
    return (
      <div className="container">
        <h1>Software anecdotes</h1>
          <Router>
            <div>
            <div style={menuColour}>
                <Link className="menu" to='/'>anecdotes</Link>&nbsp;
                <Link className="menu" to='/createnew'>create new</Link>&nbsp;
                <Link className="menu" to='/about'>about</Link>&nbsp;
           </div>
           <div style={notifColour}>{this.state.notification}</div>
              <Route exact path="/" render={() =><div>
                <AnecdoteList anecdotes={this.state.anecdotes}/> 
                <Footer /></div>} />
                <Route exact path="/anecdotes/:id" render={({ match }) =>
                    <Anecdote anecdoteOne={this.anecdoteById(match.params.id)} /> 
                }/>
                  
              <Route exact path="/about" render={() => 
              <div>
                <About />
                <Footer />
              </div>} />
              <Route exact path="/createnew" render={({ history }) => 
              <div>
                <CreateNew addNew={this.addNew} history={history}/>
                <Footer />
              </div>} />
            </div>
          </Router>
              
      </div>
    );
  }
}

export default App;
