<?php

    $floor = isset($_POST['floor']) ? $_POST['floor'] : null;
    $location = isset($_POST['location']) ? $_POST['location'] : null;

    echo useElevator($floor, $location);

    function useElevator($floor, $location){

        if($location !== 0){
            if($floor > $location){
                $direction = 'up';
                $floorsToMove =  $floor - $location;
            }else{
                $direction = 'down';
                $floorsToMove =  $location - $floor;
            }
        } else{
            $direction = 'up';
            $floorsToMove =  $floor;
        }

        $data = [
            'direction' => $direction,
            'floorsToMoves' => $floorsToMove
        ];

        return json_encode($data) ;
    }
?>