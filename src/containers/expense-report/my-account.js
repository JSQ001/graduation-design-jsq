/**
 * Created by lwj on 2017/9/6.
 */

import React  from 'react'
import httpFetch from 'share/httpFetch'
import config from 'config'

class MyAccount extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:'hailong'
        }
    }

    render(){
        return(
            <div>
                <div>
                    welcome {this.state.name}
                </div>

            </div>
        )
    }
}

export default MyAccount;
