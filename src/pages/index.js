import axios from "axios";
import React, { useEffect, useState } from "react";

const Todo = ({data}) => {

  const [name, setName] = useState('');
  const [todo, setTodo] = useState('');
  const [todos, settodods] = useState(data);

  let socket = null
  // IIFE: immediately invoked function expression
  // (() => {})()

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleTodoChange = (event) => {
    setTodo(event.target.value)
  }

  const addToList = async() => {
    try {
      const added = await axios({
        method:"post",
        url:"http://192.168.0.115:7000/api/add-todo",
        data:{name:name,todo:todo}
      })
      // const socket = new WebSocket('ws://192.168.0.115/7000');
      // socket.addEventListener('open', () => {
      //   console.log('WebSocket Connection')
      // })
      // socket.addEventListener('message', event => {
      //   console.log(`Message is: `, event.data)
      // })
      // socket.addEventListener('close')
      setName('');
      setTodo('');
      // socket.onmessage(message => {
      //   console.log('aaaaaaaaa',message);
      // });
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    (async () => {
      try {
        // let {data} = await axios({
        //   method:"get",
        //   url:"http://192.168.0.115:7000/api/list-todos"
        // })
        // settodods(data)
        // console.log(data)
      
        // const res = await fetch(`http://192.168.0.115:7000/api/list-todos`);
        // // console.log(await res.json())
        // let data = await res.json();
        // console.log(data)
        // settodods(data)

        // Server Side Rendering

      }
      catch {
        console.log("Error")
      }
    })()
  }, [])

  useEffect(() => {
    socket = new WebSocket('ws://192.168.0.115:7000');
    socket.onopen = () => {
      console.log('WebSocket Connection')
    }
    socket.onmessage = (event) => {
      settodods((prevTodos) => [...prevTodos, JSON.parse(event.data)])
 
      // console.log(`typedef`, typeof(data))
    }

    return () => socket.close();
  }, [])

  // const addTodos = async()=>{
  //   try{
  //     const response = await axios.post("http://192.168.0.115:7000/api/add-todo",{
  //     name: name,
  //     todo: todo
  //     })
      
  //     console.log("todo added succesfully",response)
  //   }catch{
  //     console.log("error")
  //   }
  // }

  return (
    <div className='items-center justify-between flex m-8'>
      <div className='items-center justify-between text-center p-4 bg-blue-100 m-4 rounded-full'>
        <div className='p-4 m-4'>
          <h3>Name:</h3>
          <input type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div className=' p-4 m-4'>
          <h3>  Todo:</h3>
          <input type="text" id="todo" value={todo} onChange={handleTodoChange} />
        </div>
        <button className='m-8 p-2 bg-gray-300 hover:bg-gray-500 rounded-lg' 
          onClick={addToList}>Submit</button>
      </div>
      {
        todos.length ?
        <div className="items-center justify-betwenn text-between p-4 m-4 bg-yellow-100">
          <div className="mb-2"> List of todos: </div>
          <ul>
            {
              todos.map(todo => <li key={todo._id} className="mb-2">
                  <div>{todo.todo}</div>
                </li>
              )
            }
          </ul>
        </div>
        : <h2>List is empty</h2>
      }
    </div>
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  let {data} = await axios({
      method:"get",
      url:"http://192.168.0.115:7000/api/list-todos"
    })
  // Pass data to the page via props
  return { props: { data } };
}

export default Todo