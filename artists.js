var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var data = require('./credentials.json');

// defining arrayay variables (song_artists = actually song artists) (title_artists = featured artists)

var count = 0
const song_artists = [25];
const title_artists = [25];
var outarray = [];

// scraping the site + creating array

var user_artists = process.argv.slice(2);
request('http://www.popvortex.com/music/charts/top-rap-songs.php', function (error, response, html) 
{
    if (!error && response.statusCode == 200) 
    {
        var $ = cheerio.load(html);
        $('em.artist').each(function(i) 
        {
            song_artists[i] = ($(this).text());
        });
        $('cite.title').each(function(i) 
        {
            title_artists[i] = ($(this).text());
        });

    }
    var array = [];
    for (i = 0; i < 25; i++) 
    {
        array[i] = ("<b>" + song_artists[i] + "</b>" + ": " + "<em>" + title_artists[i] + "</em>");
    }
    for (i = 0; i < user_artists.length; i++) 
    {
        for (j = 0; j < array.length; j++) 
        {
            if (array[j].includes(user_artists[i])) 
            {
                outarray[count] = array[j]
                count++
            }
        }
    }

// sending the email

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: data['sender-email'],
            pass: data['sender-password']
        }
    })
    var mailOptions = {
        from: data.from,
        to: data.to,
        subject: 'Your artist(s) is/are: ' + user_artists.toString().replace(",", ", "),
        html: outarray.toString().replace(",", "<br>")
    }
    if (count >= 1) 
    {
        transporter.sendMail(mailOptions, (error, info) => 
        {
            if (error) 
            {
                return console.log(error)
            }
            console.log("Email sent successfully!")
        });
    }
    else if (user_artists[0] == undefined) 
    {
        console.log("You did not specify an artist(s).")
    }
    else
        console.log("Artist(s) not within the top 25. Please try again.")
});