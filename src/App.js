import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [show_add , set_show_add] = useState(false);
  const [select , set_select] = useState(false);
  const [friends , set_friends] = useState(initialFriends);
  const [cur_friend , set_cur_friend] = useState();

  // //Because the friend list is gonna change set it to a new variable:
  // const friends = initialFriends;

  function toggle_add_friend() {
    set_show_add(!show_add);
  }

  function toggle_split_form(id) {
    set_select(!select);
    const cur_friend = friends.find(friend => friend.id===id);
    set_cur_friend(() => cur_friend);
  }

  function handle_add_friend(new_friend) {
    set_friends(() => [...friends , new_friend]);
  }

  function handle_split(balance) {
    set_friends((friends) => friends.map(friend => friend.id===cur_friend.id ? {...friend , balance:balance} : friend));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList onClick={toggle_split_form} friends={friends}/>
        {show_add ? <FormAddFriend onAddFriend={handle_add_friend}/> : ''}
        <Button onClick={toggle_add_friend}>{show_add?'Close':'Add a friend'}</Button>
      </div>
      {select? <SplitBill name={cur_friend.name} onSplit={handle_split} cur_friend={cur_friend}/> : ''}
    </div>
  )
}


function FriendList({friends , onClick}) {
  
  return (
    <ul>
      {
        friends.map(friend => (
          <Friend friend={friend} key={friend.id} onClick={onClick}/>
        ))
      }
    </ul>
  )
}


function Friend({friend , onClick}) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <span>
        <h3>{friend.name}</h3>
        <span className={friend.balance>0 ? 'green' : friend.balance<0? 'red' : ''}>
          {friend.balance>0 ? `${friend.name} owes you ${friend.balance}$` :
           friend.balance<0 ? `You owe ${friend.name} ${-friend.balance}$` :
           `You and ${friend.name} are even!`}
        </span>
      </span>
      <Button onClick={() => onClick(friend.id)}>Select</Button>
    </li>
  )
}


function Button({onClick , children}) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function FormAddFriend({onAddFriend}) {
  const [name , set_name] = useState('');
  const [img , set_img] = useState('');

  function handle_submit(e) {
    e.preventDefault();

    const new_friend = {id:new Date() , name , img , balance:0};
    onAddFriend(new_friend);
  }

  return (
    <form className="form form-add-friend" onSubmit={handle_submit}>
      <label>👩🏻‍🤝‍👩🏻Friend name</label>
      <input type="text" value={name} onChange={e => set_name(e.target.value)}/>
      <label>📷Image URL</label>
      <input type="text" value={img} onChange={e => set_img(e.target.value)}/>

      <Button>Add</Button>
    </form>
  )
}


function SplitBill({name , onSplit , cur_friend}) {
  let balance = cur_friend.balance;
  const [bill_val , set_bill_val] = useState(0);
  const [user_expense , set_user_expense] = useState(0);
  let friend_expense = 0; 
  // const [friend_expense , set_friend_expense] = useState(0);   onChange={e => set_friend_expense(e.target.value)}
  const [payer , set_payer] = useState('user');

  function handle_submit() {
    friend_expense = bill_val - user_expense;

    if(payer==='user') balance=balance+friend_expense;
    onSplit(balance);
  }
  return (
    <form className=" form form-split-bill" onSubmit={() => handle_submit}>
      <h2>SPLIT A BILL WITH {name}</h2>

      <label>💰Bill value:</label>
      <input type="text" value={bill_val} onChange={e => set_bill_val(e.target.value)}/>

      <label>💲Your expense</label>
      <input type="text" value={user_expense} onChange={e => set_user_expense(e.target.value)}/>

      <label>💲X's expense</label>
      <input type="text" value={friend_expense} disabled/>

      <label>💸Who's paying</label>
      <select value={payer} onChange={e => set_payer(e.target.value)}>
        <option value='friend'>{cur_friend.name}</option>
        <option value='user'>You</option>
      </select>

      <Button>Split bill</Button>

    </form>
  )
}