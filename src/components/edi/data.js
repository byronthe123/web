export default {
    "type" : "flight manifest",
    "id" : "be41921e-45sf-38fc-df4s-b13a9fd7psod",
    "messageHeader" : {
      "addressing" : {
        "senderAddresses" : [ {
          "type" : "PIMA",
          "address" : "SENDER00DEFAULT"
        } ],
        "finalRecipientAddresses" : [ {
          "type" : "PIMA",
          "address" : "RECEIP00DEFAULT"
        } ]
      },
      "creationDate" : "2021-09-09T16:49:32.28",
      "edifactData" : {
        "messageReference" : "MSGREF",
        "interchangeControlReference" : "ICREF"
      }
    },
    "messageSequence" : 1,
    "hasContinuation" : false,
    "flightIdAndPointOfLoading" : {
      "flightIdentification" : {
        "flight" : "TST123",
        "scheduledDate" : "2021-09-08",
        "scheduledTime" : "18:50:00"
      },
      "airportCode" : "BOS",
      "aircraftRegistration" : "HBJHF"
    },
    "pointOfUnloading" : [ {
      "airportCode" : "ZRH",
      "loadedCargo" : [ {
        "uldInformation" : {
          "uld" : {
            "type" : "AKE",
            "serialNumber" : "50217",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-21979322",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "BOM"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 3,
            "weight" : {
              "amount" : 10.4,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.08,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "CONSOLIDATION",
          "specialHandlingAndDangerousGoodsCodes" : [ "ELI", "REQ", "ECC", "EAP", "SPX" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "BOM"
            }
          } ],
          "oci" : [ {
            "isoCountryCode" : "US",
            "informationIdentifier" : "SHP",
            "controlInformation" : "CONTACT_TELEPHONE_NUMBER",
            "supplementaryControlInformation" : "9785483900"
          }, {
            "isoCountryCode" : "IN",
            "informationIdentifier" : "CNE",
            "controlInformation" : "TRADER_IDENTIFICATION_NUMBER",
            "supplementaryControlInformation" : "27AAACB0697B1Z0"
          }, {
            "isoCountryCode" : "IN",
            "informationIdentifier" : "CNE",
            "controlInformation" : "CONTACT_TELEPHONE_NUMBER",
            "supplementaryControlInformation" : "912240393939"
          } ]
        }, {
          "airWaybillNumber" : "724-21966280",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "OTP"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 2,
            "weight" : {
              "amount" : 42,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.21,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "REAGENTS AND LA",
          "specialHandlingAndDangerousGoodsCodes" : [ "ELM", "SPX" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "OTP"
            }
          } ]
        }, {
          "airWaybillNumber" : "724-21520192",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "ZRH"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 28,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.19,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "CONSOLIDATION A",
          "specialHandlingAndDangerousGoodsCodes" : [ "XPS", "EAW", "ECC" ]
        }, {
          "airWaybillNumber" : "724-21943843",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "CPT"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 2,
            "weight" : {
              "amount" : 22,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.17,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "CONSOLIDATION C",
          "specialHandlingAndDangerousGoodsCodes" : [ "ECC", "EAW" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "CPT"
            }
          } ],
          "oci" : [ {
            "isoCountryCode" : "US",
            "informationIdentifier" : "EXP",
            "controlInformation" : "MOVEMENT_REFERENCE_NUMBER",
            "supplementaryControlInformation" : "X20210907157048"
          } ]
        }, {
          "airWaybillNumber" : "724-22122822",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "ZRH"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 1,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.01,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "CONSOLIDATION",
          "specialHandlingAndDangerousGoodsCodes" : [ "XPS", "ECC", "EAW" ],
          "oci" : [ {
            "isoCountryCode" : "US",
            "informationIdentifier" : "EXP",
            "controlInformation" : "MOVEMENT_REFERENCE_NUMBER",
            "supplementaryControlInformation" : "NO EEI 30.37 A"
          } ]
        }, {
          "airWaybillNumber" : "724-22145653",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "ARN"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 20,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.10,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "RECOMBINANT MIC",
          "specialHandlingAndDangerousGoodsCodes" : [ "XPS", "ICE" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "ARN"
            }
          } ]
        }, {
          "airWaybillNumber" : "724-09308272",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "PVG"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 3.5,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 0.03,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "CONSOLIDATION A",
          "specialHandlingAndDangerousGoodsCodes" : [ "REQ", "XPS", "ECC", "EAP" ],
          "additionalSpecialHandlingCodes" : [ "XPC" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "PVG"
            }
          } ],
          "customsOriginCode" : "T1",
          "oci" : [ {
            "informationIdentifier" : "DNR",
            "controlInformation" : "DANGEROUS_GOODS",
            "supplementaryControlInformation" : "UN2289"
          }, {
            "isoCountryCode" : "US",
            "informationIdentifier" : "SHP",
            "controlInformation" : "TRADER_IDENTIFICATION_NUMBER",
            "supplementaryControlInformation" : "EIN911069248"
          }, {
            "isoCountryCode" : "CN",
            "informationIdentifier" : "CNE",
            "controlInformation" : "TRADER_IDENTIFICATION_NUMBER",
            "supplementaryControlInformation" : "USCI91310000X07262660T"
          }, {
            "isoCountryCode" : "CN",
            "informationIdentifier" : "CNE",
            "controlInformation" : "CONTACT_PERSON",
            "supplementaryControlInformation" : "ROB COOGAN"
          }, {
            "isoCountryCode" : "CN",
            "informationIdentifier" : "CNE",
            "controlInformation" : "CONTACT_TELEPHONE_NUMBER",
            "supplementaryControlInformation" : "862151531688"
          } ]
        } ]



        
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PAJ",
            "serialNumber" : "15362",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-22112016",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 4,
            "weight" : {
              "amount" : 507.2,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 7.56,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PAJ",
            "serialNumber" : "15985",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-22112016",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 126.8,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 1.89,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        }, {
          "airWaybillNumber" : "724-22111946",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 83,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 1.89,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "FILTERING EQU 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        }, {
          "airWaybillNumber" : "724-22111972",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 90,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 1.89,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        }, {
          "airWaybillNumber" : "724-22112064",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 1,
            "weight" : {
              "amount" : 104,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 1.51,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PMC",
            "serialNumber" : "25182",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-22111950",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 5,
            "weight" : {
              "amount" : 582,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 9.45,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQU 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PMC",
            "serialNumber" : "25321",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-22111950",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 5,
            "weight" : {
              "amount" : 582,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 9.45,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQU 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PMC",
            "serialNumber" : "25438",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-22112016",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 5,
            "weight" : {
              "amount" : 634,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 9.45,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PMC",
            "serialNumber" : "33253",
            "ownerCode" : "LX"
          }
        },
        "consignments" : [ {
        //   "airWaybillNumber" : "724-22112031",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 5,
            "weight" : {
              "amount" : 613,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 9.45,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        // "uldInformation" : {
        //   "uld" : {
        //     "type" : "PMC",
        //     "serialNumber" : "37027",
        //     "ownerCode" : "LH"
        //   }
        // },
        "consignments" : [ {
          "airWaybillNumber" : "724-22112031",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "SPLIT_CONSIGMENT",
            "numberOfPieces" : 5,
            "weight" : {
              "amount" : 613,
              "unit" : "KILOGRAM"
            }
          },
          "totalNumberOfPieces" : 10,
          "volumeDetail" : {
            "amount" : 9.45,
            "unit" : "CUBIC_METRE"
          },
          "totalConsignmentPieces" : 10,
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      }, {
        "uldInformation" : {
          "uld" : {
            "type" : "PMC",
            "serialNumber" : "47206",
            // "ownerCode" : "LH"
          }
        },
        "consignments" : [ {
          "airWaybillNumber" : "724-22111994",
          "originAndDestination" : {
            "origin" : "BOS",
            "destination" : "SXB"
          },
          "quantity" : {
            "shipmentDescriptionCode" : "TOTAL_CONSIGNMENT",
            "numberOfPieces" : 5,
            "weight" : {
              "amount" : 774,
              "unit" : "KILOGRAM"
            }
          },
          "volumeDetail" : {
            "amount" : 9.45,
            "unit" : "CUBIC_METRE"
          },
          "manifestDescriptionOfGoods" : "FILTERING EQ 3",
          "specialHandlingAndDangerousGoodsCodes" : [ "EAW", "ECC", "HEA" ],
          "additionalSpecialHandlingCodes" : [ "DIR", "TRZ" ],
          "onwardRoutingAndBooking" : [ {
            "routing" : {
              "carrierCode" : "LX",
              "destination" : "SXB"
            }
          } ]
        } ]
      } ]
    } ]
  };
