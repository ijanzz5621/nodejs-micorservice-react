/* eslint-disable import/no-anonymous-default-export */
//import React, {useState, useEffect} from "react";
import React from "react";

export default ({comments}) => {
    
    const renderedComments = comments.map(comment => {

        let content;

        if (comment.status === 'approved') {
            content = comment.content;
        }

        if (comment.status === 'pending') {
            content = 'you comment is awaiting moderation';
        }

        if (comment.status === 'rejected') {
            content = 'the comment has been rejected!!';
        }

        return (
            <li key={comment.id}>{content}</li>
        );
    });

    return (
        <div>
            <div>Comment Listing</div>
            <ul className="d-flex flex-col flex-wrap justify-content-between">{renderedComments}</ul>
        </div>
    );
}