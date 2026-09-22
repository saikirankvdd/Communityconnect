package com.communityconnect.exception;

public class CommunityAccessDeniedException extends RuntimeException {
    public CommunityAccessDeniedException(String message) {
        super(message);
    }
}
