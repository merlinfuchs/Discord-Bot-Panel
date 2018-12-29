/*jshint esversion: 6 */

function addData(chart, _dataset, label, data) {
  if (chart.data.labels.slice(-1)[0] != label) {
    chart.data.labels.push(label);
  }

  chart.data.datasets.forEach((dataset) => {
    if (dataset.label == _dataset) {
      dataset.data.push(data);
    }
  });
  chart.update();
}

function removeLastData(chart, dataLimit) {
  if (chart.data.labels.length > dataLimit) {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
    chart.data.labels.shift();
  }
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

function createCharts(client) {
  createGuildChart(client);
  createChannelChart(client);
  createActivityChart(client);
  createEventChart(client);
}

function createChannelChart(client) {
  var voice = 0;
  var text = 0;

  client.channels.forEach(function(channel) {
    if (channel.type === 'text') {
      text++;
    } else if (channel.type === 'voice') {
      voice++;
    }
  });

  var channelContainer = document.getElementById("channelChart").getContext('2d');
  var channelChart = new Chart(channelContainer, {
    type: 'pie',
    data: {
      labels: ["Text-Channels", "Voice-Channels"],
      datasets: [{
        data: [text, voice],
        backgroundColor: ["#F7464A", "#46BFBD"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1"]
      }]
    },
    options: {
      responsive: true
    }
  });
}

function createActivityChart(client) {
  var activities = {};
  var counted = [];

  client.guilds.forEach(function(guild) {
    guild.members.forEach(function(member) {
      if (!counted.includes(member.id)) {
        if (member.presence.game) {
          game = member.presence.game.name;
          if (game in activities) {
            activities[game]++;
          } else {
            activities[game] = 1;
          }
        }
        counted.push(member.id);
      }
    });
  });

  var keysToDisplay = getSortedKeys(activities).slice(0, 5);
  var valuesToDisplay = [];
  keysToDisplay.forEach(function(key) {
    valuesToDisplay.push(activities[key]);
  });

  var activityContainer = document.getElementById("activityChart").getContext('2d');
  var activityChart = new Chart(activityContainer, {
    type: 'polarArea',
    data: {
      labels: keysToDisplay,
      datasets: [{
        data: valuesToDisplay,
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
      }]
    },
    options: {
      responsive: true
    }
  });
}

function createGuildChart(client) {
  var guilds = {
    "> 5000": 0,
    "> 1000": 0,
    "> 500": 0,
    "> 100": 0,
    "< 100": 0
  };

  client.guilds.forEach(function(guild) {
    var members = guild.memberCount;
    if (members > 5000) {
      guilds["> 5000"]++;
    } else if (members > 1000) {
      guilds["> 1000"]++;
    } else if (members > 500) {
      guilds["> 500"]++;
    } else if (members > 100) {
      guilds["> 100"]++;
    } else {
      guilds["< 100"]++;
    }
  });



  var guildsContainer = document.getElementById("guildsChart").getContext('2d');
  var guildsChart = new Chart(guildsContainer, {
    type: 'doughnut',
    data: {
      labels: Object.keys(guilds),
      datasets: [{
        data: Object.values(guilds),
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
      }]
    },
    options: {
      responsive: true
    }
  });
}

function createEventChart(client) {
  var eventContainer = document.getElementById("eventChart").getContext('2d');
  var eventChart = new Chart(eventContainer, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
          label: "messageSend",
          data: [],
          backgroundColor: [
            'rgba(105, 0, 132, .2)',
          ],
          borderColor: [
            'rgba(200, 99, 132, .7)',
          ],
          borderWidth: 2
        },
        {
          label: "presenceUpdate",
          data: [],
          backgroundColor: [
            'rgba(0, 137, 132, .2)',
          ],
          borderColor: [
            'rgba(0, 10, 130, .7)',
          ],
          borderWidth: 2
        },
        {
          label: "guildMemberAdd",
          data: [],
          backgroundColor: [
            'rgba(235, 22, 21, .2)',
          ],
          borderColor: [
            'rgba(235, 22, 21, .7)',
          ],
          borderWidth: 2
        },
        {
          label: "reactionAdd",
          data: [],
          backgroundColor: [
            'rgba(99, 0, 125, .2)',
          ],
          borderColor: [
            'rgba(99, 0, 125, .7)',
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true
    }
  });

  var events = {
    messageSend: 0,
    presenceUpdate: 0,
    guildMemberAdd: 0,
    reactionAdd: 0
  };

  client.on('message', function(msg) {
    events.messageSend++;

    if (msg.content == "") {
      return;
    }
    $('#messagesTab').prepend(`
      <div class="card m-3">
        <div class="card-body">
          <h5 class="card-title">${msg.author.username} <span class="badge badge-light">#${msg.author.discriminator}</span></h5>
          ${msg.content}
        </div>
      </div>
      `);
  });

  client.on('presenceUpdate', function(oldMember, newMember) {
    events.presenceUpdate++;
  });

  client.on('guildMemberAdd', function(member) {
    events.guildMemberAdd++;
  });

  client.on('messageReactionAdd', function(reaction, user) {
    events.reactionAdd++;
  });

  var seconds = 0;
  client.setInterval(function() {
    seconds++;
    for (var event in events) {
      addData(eventChart, event, seconds, events[event]);
      removeLastData(eventChart, 50);
      events[event] = 0;
    }
  }, 1000);
}

function getSortedKeys(obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys.sort(function(a, b) {
    return obj[b] - obj[a];
  });
}
