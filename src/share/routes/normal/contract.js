import MyContract from 'containers/contract/my-contract'
import NewContract from 'containers/contract/new-contract'
import ContractDetail from 'containers/contract/contract-detail'

//合同
const contract = {
  key:'contract',
  icon: 'file',
  subMenu: [
    //我的合同
    {
      key:'my-contract',
      url:'/main/contract/my-contract',
      components: MyContract ,
      parent: 'contract',
      children: {
        //新建合同
        newContract: {
          key: 'new-contract',
          url: '/main/contract/my-contract/new-contract',
          components: NewContract,
          parent: 'my-contract'
        },
        //编辑合同
        editContract: {
          key: 'edit-contract',
          url: '/main/contract/my-contract/edit-contract/:id',
          components: NewContract,
          parent: 'my-contract'
        },
        //合同详情
        contractDetail: {
          key: 'contract-detail',
          url: '/main/contract/my-contract/contract-detail/:id',
          components: ContractDetail,
          parent: 'my-contract'
        }
      }
    }
  ]
};

export default contract
