import React,{useState,useEffect, useCallback}from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies,setMovies]=useState([]);
  const[isLoading,setIsLoading]=useState(false);
  const[error,setError]=useState(null);
 
 const fetchMovieHandler=useCallback( async ()=>{
    setIsLoading(true);
    setError(null);
    try{
      const data= await fetch("https://reacthttp-13044-default-rtdb.firebaseio.com/movies/.json");
      if(!data.ok){
        throw new Error("something went wrong!");
      }
    const movieinfo= await data.json();
    const loadedMovies=[];
    for (const key in movieinfo){
      loadedMovies.push({
        id:key,
        title:movieinfo[key].title,
        openingText:movieinfo[key].openingText,
        releaseDate:movieinfo[key].releaseDate
      });
    }
    console.log(data);
    
    setMovies(loadedMovies);
    }
    catch(error){
      setError(error.message)
    }
    setIsLoading(false);
  },[]);
 

 useEffect(()=>{
  fetchMovieHandler();
},[]);


async function addMovieHandler(movie){
  const response=await fetch("https://reacthttp-13044-default-rtdb.firebaseio.com/movies/.json",{
    method:'POST',
    body:JSON.stringify(movie), 
    headers:{
      "content-Type":"application/json"
    }
  });
  const data= await response.json();
  console.log(data);
}
  
  let content=<p>No movies found..</p>
  if(movies.length>0){
   content= <MoviesList movies={movies}/>
  }
  if(error){
    content=<p>{error}</p>
  }
  if(isLoading){
    content=<p>Loading....</p>
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
       {content}
      </section>
    </React.Fragment>
  );
  }
export default App;
