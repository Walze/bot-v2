import { actionBehaviour } from "../../../types"
import { Requirements } from '../../classes/Requirements'
import Action from '../../classes/Action'
import Commands from '../../classes/Commands'
import client from '../../../setup'
import { sql } from '../../../database/db';
import { GuildActive } from '../../../database/models/GuildActive';
import { RichEmbedOptions } from 'discord.js';
import { MessageAverage } from './../../../database/classes/MessageAverage';

const requirements: Requirements = {
    text: false,
    params: {
        limit: false,
    }
}

const description = 'Lists the most active users using the average time between messages'

const action: actionBehaviour = async req => {
    const { id: guild_id } = req.msg.guild
    const { limit } = req.params

    const records = await GuildActive.findAll({
        where: {
            guild_id,
            totalMessages: { [sql.Op.gt]: limit || 10 }
        },
        // limit: 5,
        // order: [['messageAvg', 'ASC']]
    })

    const recordsFiltered = (await Promise.all(
        records.map(async record => {
            const updatedRecord = await MessageAverage.calculate(record)
            const { username, tag } = await client.fetchUser(record.user_id)
            const lastMessage = new Date(updatedRecord.lastMessage).toJSON().slice(0, 10).split('-').reverse().join('/')

            return {
                lastMessage,
                username,
                tag,
                avg: Math.round(updatedRecord.messageAvg)
            }
        })
    ))
        .sort((a, b) => a.avg - b.avg)
        .slice(0, 5)

    const embed: RichEmbedOptions = {
        title: 'Leaderboard',
        fields: recordsFiltered.map((u, i) => {
            return {
                name: `#${i + 1} - ${u.tag} @ ${u.lastMessage}`,
                value: `${u.avg} seconds between messages`
            }
        })
    }


    req.msg.channel.send('Current most active users are...', { embed })
}

const def = new Action(requirements, action, description)
Commands.add('leaderboard', def)
