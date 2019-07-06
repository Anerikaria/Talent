import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { addUpdateJob, updateStateData } from '../CreateJob/CreateJob.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, List, PaginationItem, PaginationLink } from 'semantic-ui-react';
import axios from 'axios';
import accordion from '../accordion.js';




export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            currentPage: 1,
            cardsPerPage: 3,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            activeIndex: "1",
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handleClick = this.handleClick.bind(this);
        //this.handleSortbyFilter = this.handleSortbyFilter.bind(this);
        this.onChangedropdown = this.onChangedropdown.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData, });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.loadData();
    };



    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        URL = 'http://localhost:51689/listing/listing/getSortedEmployerJobs'

        axios.get(URL, {

            headers: {
                'authorization': 'bearer ' + cookies,
                'content-type': 'application/json'
            }
        }).then(response => {

            console.log("GetJobDetails:", response);
            this.setState({
                loadJobs: response.data.myJobs
            });
        }).catch(err => console.log("err:", err));

        this.init();

    };


    handleClick(event) {
        event.preventDefault();
        let listid = Number(event.target.id);
        this.setState({
            currentPage: listid
        });
        //$("ul li.active").removeClass('active');
        //$('ul li#' + listid).addClass('active');
    }


    handleUserUpdated() {

        var cookies = Cookies.get('talentAuthToken');

    }

    onChangedropdown() {
        event.preventDefault();
        console.log(this.state.date);
        this.setstate({
            loadJobs : this.state.date
        })
    }



        loadNewData(data) {
            var loader = this.state.loaderData;
            loader.isLoading = true;
            data[loaderData] = loader;
            this.setState(data, () => {
                this.loadData(() => {
                    loader.isLoading = false;
                    this.setState({
                        loadData: loader
                    })
                })
            });
        }

    render() {

        const { loadJobs, currentPage, cardsPerPage } = this.state;

        //logic for displaying three cards 
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        const loadJob = loadJobs.slice(indexOfFirstCard, indexOfLastCard);
        let renderJob = loadJob;
        let job = null;




        // Logic for displaying page numbers
        let pageNumbers = [];
        for (let i = 1; i <= Math.ceil(loadJobs.length / cardsPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <span style={{ textAlign: 'center', marginRight: '5px', cursor: 'pointer' }}
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </span>
            );
        });


        if (job != "") {
            job = renderJob.map((list) =>
                <div key={list.id}>
                    <div className="ui card" style={{ margin: '20px', height: '380px', width: '300px' }}>
                        <div className="content">
                            <a className="ui black right ribbon label"><i className="user icon"> 0 </i></a>
                            <div className="header">
                                {list.title}
                                <div className="meta">
                                    <span>{list.location.city + ','}</span>
                                    <span>{list.location.country}</span>
                                    <p>We have a Position for {list.title}</p>
                                </div>
                            </div>
                        </div>

                        <div className="Card.Content extra" >
                            <button className="ui red button" style={{ fontSize: '13px', color: 'white', paddingLeft: '4px', paddingRight: '4px' }}>
                                Expired
                                                   </button>


                            <div className="ui basic blue buttons" style={{ float: 'right', color: 'blue', padding: '0px' }}>

                                <button className="ui button" style={{ fontSize: '13px', marginLeft: '0px', paddingLeft: '8px', paddingRight: '24px' }}>
                                    <i className="close icon" style={{ paddingRight: '4px' }}  >Close</i>
                                </button>
                                <button className="ui button" style={{ fontSize: '13px', marginLeft: '0px', paddingLeft: '8px', paddingRight: '24px' }}>
                                    <i className="edit icon" style={{ paddingRight: '4px' }}>Edit</i>
                                </button>
                                <button className="ui button" style={{ fontSize: '13px', marginLeft: '0px', paddingLeft: '8px', paddingRight: '24px' }}>
                                    <i className="copy icon" style={{ paddingRight: '4px' }}>Copy</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )

        }


        else if (job = "") {
            <span><strong>No</strong> Jobs found</span>

        }
     


            


            return (

                < BodyWrapper reload={this.init} loaderData={this.state.loaderData} >
                    <div className="ui container">
                        <div>
                            <h1>List of Jobs</h1>
                        </div>


                        <div className="ui dropdown">
                            <i className="filter icon"></i>
                            <span className="text">Filter: </span>
                            <span className="text"><strong>Choose filter</strong></span>
                            <i className="dropdown icon"></i>
                            <div className="menu">
                                <div className="item">Google Docs</div>
                                <div className="item">Google Drive</div>
                            </div>
                        </div>

                        <div className="ui dropdown">
                            <i className="calendar icon"></i>
                            <span className="text">Sort by date: </span>
                            <span className="text"><strong>Choose filter</strong></span>
                            <i className="dropdown icon"></i>
                            <div className="menu" >
                                <div  key='1' className="item" onSelect={this.onChangedropdown} >Newest First</div>
                                <div  className="item" key='2'>Oldest First</div>
                          
                            </div>
                        </div>

                        <div>

                            <div className="ui three stackable cards" style={{ margin: '20px' }}>

                                {
                                    job
                                }



                            </div>

                                

                                      {
                                    //        pageNumbers.map((number, i) =>
                                    //        <Pagination key={i}>
                                    //            <PaginationItem active={pageNumbers[currentPage - 1] === (number) ? true : false} >
                                    //                <PaginationLink onClick={this.handleClick} href={number} key={number} id={number}>
                                    //                    {number}
                                    //                </PaginationLink>
                                    //            </PaginationItem>
                                    //        </Pagination>
                                    //    )}
                                }

                        </div>


                        <div style={{ textAlign: 'center' }}>
                        <span className="Pagination"  >
                            {renderPageNumbers}
                        </span>
                        </div>

                    </div>
                </BodyWrapper >

            )
        }

    }

