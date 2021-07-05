import React from 'react';

import { Badge } from './Badge';
import { Icon } from "./Icon";

export default {
    title: 'Example/Badge',
    component: Badge,
    parameters: {
        viewport: {
            defaultViewport: "mobile1"
        },
        backgrounds: {
            // default: "dark",
            default: "myColor",
            values: [
                { name: "myColor", value: "#80aced"}
            ]
        }
    },
    // argTypes: {
    //     status: {
    //         control: {
    //             type: "select",
    //             options: ["positive", "warning"]
    //         }
    //     }
    // }
};

export const BadgeStory = (args) => <Badge {...args}>{args.label ?? "Hello world"}</Badge>;
BadgeStory.storyName= "Badge custom name";
BadgeStory.args = {
    label: "Some text"
};

export const BadgeWithIcon = (args) => <Badge {...args}>
    <Icon icon={args.icon} />
    {args.label ?? "Hello world"}
</Badge>;
BadgeWithIcon.args = {
    icon: "facehappy",
    status: "neutral",
    label: "test"
}
BadgeWithIcon.argTypes = {
    status: {
        control: {
            type: "select",
            options: ["positive", "warning"]
        }
    }
}
