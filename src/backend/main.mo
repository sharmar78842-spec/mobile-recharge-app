import Array "mo:core/Array";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";

actor {
  type Recharge = {
    id : Nat;
    phoneNumber : Text;
    operator : Text;
    planName : Text;
    amount : Nat;
    validity : Text;
    date : Int;
    status : Text;
  };

  module Recharge {
    public func compareByDate(recharge1 : Recharge, recharge2 : Recharge) : Order.Order {
      Int.compare(recharge2.date, recharge1.date);
    };
  };

  var nextId = 0;
  let rechargesList = List.empty<Recharge>();

  public shared ({ caller }) func submitRecharge(phoneNumber : Text, operator : Text, planName : Text, amount : Nat, validity : Text) : async Nat {
    let recharge : Recharge = {
      id = nextId;
      phoneNumber;
      operator;
      planName;
      amount;
      validity;
      date = Time.now();
      status = "Success";
    };

    nextId += 1;
    rechargesList.add(recharge);
    recharge.id;
  };

  public query ({ caller }) func getRechargeHistory(phoneNumber : Text) : async [Recharge] {
    rechargesList.filter(
      func(recharge) {
        recharge.phoneNumber == phoneNumber;
      }
    ).toArray().sort(Recharge.compareByDate);
  };

  public query ({ caller }) func getRecharge(rechargeId : Nat) : async Recharge {
    switch (rechargesList.toArray().find(func(recharge) { recharge.id == rechargeId })) {
      case (null) { Runtime.trap("Recharge not found") };
      case (?recharge) { recharge };
    };
  };

  public query ({ caller }) func getAllRecharges() : async [Recharge] {
    rechargesList.toArray();
  };
};
