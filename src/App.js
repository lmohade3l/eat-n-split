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
  // const [select , set_select] = useState(false);
  const [friends , set_friends] = useState(initialFriends);
  const [cur_friend , set_cur_friend] = useState(null);

  // //Because the friend list is gonna change set it to a new variable:
  // const friends = initialFriends;

  function show_add_friend() {
    set_show_add((show_add)=> !show_add);
  }

  function show_split_form(friend) {
    set_show_add(false);
    //Optional chaining because when there's no cur_friend can't find the id.
    if(cur_friend?.id===friend.id) set_cur_friend(null);
    else set_cur_friend(friend);
  }

  function handle_add_friend(new_friend) {
    set_friends(() => [...friends , new_friend]);
    //Close the form
    set_show_add(false);
  }

  function handle_split(balance) {
    console.log(balance);
    set_friends((friends) => friends.map(friend => friend.id===cur_friend.id ? {...friend , balance:balance} : friend));

    set_cur_friend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* When rendering the friends, you gotta know who the cur_frind is. */}
        <FriendList onClick={show_split_form} friends={friends} cur_friend={cur_friend}/>
        {show_add ? <FormAddFriend onAddFriend={handle_add_friend}/> : ''}
        <Button onClick={show_add_friend}>{show_add?'Close':'Add a friend'}</Button>
      </div>
      {/* When there IS a cur_friend show the split form. */}
      {cur_friend? <SplitBill onSplit={handle_split} cur_friend={cur_friend}/> : ''}
    </div>
  )
}


function FriendList({friends , onClick , cur_friend}) {
  return (
    <ul>
      {
        friends.map(friend => (
          <Friend friend={friend} key={friend.id} onClick={onClick} cur_friend={cur_friend}/>
        ))
      }
    </ul>
  )
}


function Friend({friend , onClick , cur_friend}) {
  const is_cur_friend = friend.id===cur_friend?.id;

  return (
    <li className={is_cur_friend? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <span>
        <h3>{friend.name}</h3>
        <span className={friend.balance>0 ? 'green' : friend.balance<0? 'red' : ''}>
          {friend.balance>0 ? `${friend.name} owes you ${friend.balance}$` :
           friend.balance<0 ? `You owe ${friend.name} ${-friend.balance}$` :
           `You and ${friend.name} are even!`}
        </span>
      </span>
      <Button onClick={() => onClick(friend)}>{is_cur_friend ? 'Close' : 'Select'}</Button>
    </li>
  )
}


function Button({onClick , children}) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function FormAddFriend({onAddFriend}) {
  const [name , set_name] = useState('');
  const [img , set_img] = useState('https://i.pravatar.cc/48');

  function handle_submit(e) {
    e.preventDefault();

    if(!name || !img) return;

    const id = crypto.randomUUID();
    const new_friend = {id , name , img:`${img}?=${id}` , balance:0};

    set_name('');
    set_img('https://i.pravatar.cc/48');

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

//FIXME if clicked on another friend, it preserves the state and doesn't reset the form.
function SplitBill({onSplit , cur_friend}) {
  const [bill_val , set_bill_val] = useState('');
  const [user_expense , set_user_expense] = useState('');
  const [payer , set_payer] = useState('user');
  const friend_expense = bill_val? bill_val - user_expense : ''; 

  // let balance = cur_friend.balance;
  // const [balance , set_balance] = useState(cur_friend.balance);
  // const [friend_expense , set_friend_expense] = useState(0);   

  function handle_submit(e) {
    e.preventDefault();
    
    if(!bill_val || !user_expense) return;

    let balance = cur_friend.balance;
    if(payer==='user') balance =balance+friend_expense;
    else balance = balance-user_expense;

    onSplit(balance);
  }
  return (
    <form className=" form form-split-bill" onSubmit={handle_submit}>
      <h2>SPLIT A BILL WITH {cur_friend.name}</h2>

      <label>💰Bill value:</label>
      <input type="text" value={bill_val} onChange={e => set_bill_val(+e.target.value)}/>

      <label>💲Your expense</label>
      <input type="text" value={user_expense} onChange={e => set_user_expense(+e.target.value> bill_val?user_expense: +e.target.value)}/>

      <label>💲{cur_friend.name}'s expense</label>
      <input type="text" disabled value={friend_expense}/>

      <label>💸Who's paying</label>
      <select value={payer} onChange={e => set_payer(e.target.value)}>
        <option value='friend'>{cur_friend.name}</option>
        <option value='user'>You</option>
      </select>

      <Button>Split bill</Button>

    </form>
  )
}