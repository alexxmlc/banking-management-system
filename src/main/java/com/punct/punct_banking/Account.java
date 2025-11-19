package com.punct.punct_banking;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
public class Account {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // Creates user_id column in task table
    @JsonIgnore // When we ask for a task we don't want it to return the user
    @ToString.Exclude 
    @EqualsAndHashCode.Exclude 
    private User user;
}
