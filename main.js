let records = 5
let ascending=true
let data;

function getData() {
  if(data) {
    sortRecords(data);  
    let cb = getRecords(data);
    getPagination(data.length, records, cb)
  } else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        
        data = JSON.parse(this.response);
        sortRecords(data);
        let cb = getRecords(data);
        getPagination(data.length, records, cb)
        }
    }
    xhttp.open("GET", "https://api.jsonbin.io/b/5c8b8f39e5cf2761bec30213", true);
    xhttp.send();
  }
}

function changeRecords(data) {
  records = data.value;
}

let loadPaginatedRecords = (i, records, cb) => {
  // alert("World"+cb(i, records));
  document.getElementById("main-content").innerHTML = "";
  let currentRecords = cb(i, records);
  for (let i of currentRecords) {
    let node = document.createElement("div");
    let pTag = document.createElement('p');
    pTag.innerHTML = i.name;
    node.appendChild(pTag);
    document.getElementById("main-content").appendChild(node)
  }
}

function sortRecords(data) {
  data.sort(function(a, b) {
    if (ascending) {
      if (a.name < b.name) {
        return -1
      }
      return 0;
    } else {
      if (a.name > b.name) {
        return -1
      }
      return 0;
    }
  });
}

function sortChange() {
  ascending=false;
  getData();
}


function getRecords(data) {
  return function(index, records) {
    let result = [];
    let start = index * records;
    let end = start + records;
    for (let i=start; i<end; i++) {
      if (data[i]) {
        result.push(data[i]);
      }
    }
    return result;
  }
}

function getPagination(total, records, cb) {
  let data = Math.ceil(total / records);
  let values = [];
  document.getElementById("pagination").innerHTML = "";
  document.getElementById("main-content").innerHTML = "";
  for (let i =0; i< data; i++) {
    let node = document.createElement("li");
    node.id = `li${i}`;
    node.className = 'block';
    var aTag = document.createElement('a');
    aTag.setAttribute('href',"#");
    aTag.innerHTML = i+1;
    node.appendChild(aTag);
    node.addEventListener('click', function() {
      loadPaginatedRecords(i, records, cb);
    });
    document.getElementById("pagination").appendChild(node)
    values.push(i)
  }
  return values;
}

function pagination(pageNum) {
  
}

function showRecords(data, i) {
  let n = data.length;
  while (i < n) {
    for (let j=0; j<records; j++) {
      let node = document.createElement("div");
      node.id = 'block';
      node.className = 'block';
      let textnode = document.createTextNode("Water");
      let repoName = data[i + j]
    }
    i += records
  }
}