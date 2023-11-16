import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();
  const [page,setPage]=useState(0);
  const handlePageClick=(data)=>{
    setPage(data.selected);
  }
  const getAll = async () =>{
    const { data } = await axios.get(`/api/foods?page=${page}`);
    return data;
  };

  useEffect(() => {
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag,page]);

  return (
    <>
      <Search />
      <Tags tags={tags} />
      {foods.length === 0 && <NotFound linkText="Reset Search" />}
      <Thumbnails foods={foods} />
      <ReactPaginate
       containerClassName='pagination justify-content-center'
       pageClassName='page-item'
       pageLinkClassName='page-link'
        breakLabel="..."
        nextLabel="next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={1000}
        previousClassName='page-item'
        previousLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        previousLabel="previous"
        renderOnZeroPageCount={null}
        activeClassName='active'
      />
    </>
  );
}
