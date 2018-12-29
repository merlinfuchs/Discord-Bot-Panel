/*jshint esversion: 6 */

$('#findButton').click(function() {
  var what = $('#findWhat').val();
  var by = $('#findBy').val();
  var value = $('#findValue').val();

  var table = $('#findOutput');
  var tBody = $('#findOutput tbody');
  var tHead = $('#findOutput thead');

  if (what == 'users') {
    tHead.html(`
      <tr>
        <th>Tag</th>
        <th>Id</th>
        <th>Avatar</th>
      </tr>
      `);
    tBody.html('');

    by = (by == 'name') ? 'username' : by;

    client.users.forEach(function(user) {
      if (user[by] == value) {
        tBody.append(`
          <tr>
            <td>${user.username}#${user.discriminator}</td>
            <td>${user.id}</td>
            <td>${user.displayAvatarURL}</td>
          </tr>
          `);
      }
    });

  } else if (what == 'guilds') {
    tHead.html(`
      <tr>
        <th>Name</th>
        <th>Id</th>
        <th>Owner</th>
      </tr>
      `);
    tBody.html('');

    client.guilds.forEach(function(guild) {
      if (guild[by] == value) {
        tBody.append(`
          <tr>
            <td>${guild.name}</td>
            <td>${guild.id}</td>
            <td>${guild.ownerID}</td>
          </tr>
          `);
      }
    });

  } else if (what == 'roles') {
    tHead.html(`
      <tr>
        <th>Name</th>
        <th>Id</th>
        <th>Guild</th>
      </tr>
      `);
    tBody.html('');

    client.guilds.forEach(function(guild) {
      guild.roles.forEach(function(role) {
        if (role[by] == value) {
          tBody.append(`
            <tr>
              <td>${role.name}</td>
              <td>${role.id}</td>
              <td>${guild.id}</td>
            </tr>
            `);
        }
      });
    });

  } else if (what == 'channels') {
    tHead.html(`
      <tr>
        <th>Name</th>
        <th>Id</th>
        <th>Guild</th>
      </tr>
      `);
    tBody.html('');

    client.guilds.forEach(function(guild) {
      guild.channels.forEach(function(channel) {
        if (channel[by] == value) {
          tBody.append(`
            <tr>
              <td>${channel.name}</td>
              <td>${channel.id}</td>
              <td>${guild.id}</td>
            </tr>
            `);
        }
      });
    });

  }
});
