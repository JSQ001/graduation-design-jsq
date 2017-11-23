import React  from 'react'
import SearchArea from 'components/search-area'
import Chooser from 'components/chooser'

class MyAccount extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        searchForm: [{
          type: 'value_list', label: '消息：', id: 'messageCode', options: [], valueListCode: 2022
        }, {
          type: 'list', label: '人员', id: 'user', options: [], labelKey: 'fullName', valueKey: 'id', listType: 'user', inputEnabled: true
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
          <Chooser type="user" labelKey="fullName" valueKey="userOID" onChange={(e) => {console.log(e)}} inputEnabled/>
        </div>
      )
    }
}

export default MyAccount;
