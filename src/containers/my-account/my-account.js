import React  from 'react'
import SearchArea from 'components/search-area'
import Selput from 'components/selput'

class MyAccount extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        searchForm: [{
          type: 'value_list', label: '消息：', id: 'messageCode', options: [], valueListCode: 2022
        }, {
          type: 'selput', label: '人员', id: 'user', valueKey: 'fullName', listType: 'user'
        }]
      }
    }

    search = (result) => {
      console.log(result)
    };

    render(){
      const { searchForm } = this.state;
      return(
        <div>
          <SearchArea searchForm={searchForm}
                      submitHandle={this.search}/>
          <br/>
          <Selput type="user" valueKey="fullName" onChange={(e) => {console.log(e)}}/>
        </div>
      )
    }
}

export default MyAccount;
